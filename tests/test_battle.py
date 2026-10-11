"""Browser regression checks. Run: python -m unittest discover -s tests -v.
Requires the Python playwright package and a Chromium executable.
"""
import functools
import http.server
import os
from pathlib import Path
import shutil
import threading
import unittest

from playwright.sync_api import sync_playwright, expect


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # The source-only checkout may omit binary art. Keep its layout dimensions.
        if self.path.startswith('/assets/') and not Path(self.translate_path(self.path)).exists():
            art = b'<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="100%" height="100%" fill="#d8ccba"/></svg>'
            self.send_response(200)
            self.send_header('Content-Type', 'image/svg+xml')
            self.send_header('Content-Length', str(len(art)))
            self.end_headers()
            self.wfile.write(art)
            return
        super().do_GET()

    def log_message(self, *_args):
        pass


class BattleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        root = Path(__file__).resolve().parents[1]
        handler = functools.partial(QuietHandler, directory=str(root))
        cls.server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.playwright = sync_playwright().start()
        executable = os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
        cls.browser = cls.playwright.chromium.launch(executable_path=executable, headless=True, args=['--no-sandbox'])
        cls.url = f'http://127.0.0.1:{cls.server.server_port}/'

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 1280, 'height': 900})
        self.page = self.context.new_page()
        self.page.set_default_timeout(5000)
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))
        # Capture the real controller without adding a production debug interface.
        self.page.add_init_script('''
          Math.random = () => 0.99;
          Object.defineProperty(window, 'DYB_BATTLE', {
            configurable: true,
            set(module) {
              const create = module.create;
              module.create = (...args) => {
                window.testBattle = create(...args);
                return window.testBattle;
              };
              Object.defineProperty(window, 'DYB_BATTLE', { value: module });
            }
          });
        ''')
        self.page.goto(self.url)
        self.page.select_option('#aiProvider', 'local')

    def tearDown(self):
        self.assertEqual(self.errors, [])
        self.context.close()

    def begin(self):
        self.page.click('#generate')
        self.page.click('#beginReview')

    def scores(self):
        return self.page.locator('#passChecklist .check em').all_text_contents()

    def fill_collage(self, touch=False):
        for kind in ['opening', 'move', 'concept', 'proof']:
            tile = self.page.locator(f'.chip[data-type="{kind}"]').first
            if kind == 'proof':
                tile = self.page.get_by_role('button', name='我们记录了三位使用者的停留时间', exact=True)
            slot = self.page.locator(f'.slot[data-slot="{kind}"]')
            if touch:
                tile.tap()
                slot.tap()
            else:
                tile.click()
                slot.click()

    def submit_and_settle(self):
        self.page.click('#submitDefense')
        if self.page.locator('#battle').is_visible():
            self.page.click('#battleStart')
            self.fill_collage()
            self.page.click('#battleSubmit')
        expect(self.page.locator('#nextRound')).to_be_enabled()

    def test_trigger_priority_probabilities_and_reset(self):
        result = self.page.evaluate("""() => {
          const battle = window.testBattle;
          Math.random = () => 0.99;
          const threshold = battle.pickTrigger({discomfort:10}, {depth:9});
          const below = battle.pickTrigger({discomfort:9}, {depth:9});
          Math.random = () => 0.34;
          const admiration = battle.pickTrigger({discomfort:0}, {depth:6});
          Math.random = () => 0.11;
          const surprise = battle.pickTrigger({discomfort:0}, {depth:5});
          Math.random = () => 0.12;
          const boundary = battle.pickTrigger({discomfort:0}, {depth:5});
          battle.open('pressure', 'TEST', 'PROJECT', () => ({}), () => {});
          Math.random = () => 0.99;
          const used = battle.pickTrigger({discomfort:20}, {depth:9});
          battle.reset();
          const reset = battle.pickTrigger({discomfort:10}, {depth:0});
          return {threshold, below, admiration, surprise, boundary, used, reset};
        }""")
        self.assertEqual(result, {'threshold':'pressure','below':None,'admiration':'admiration','surprise':'surprise','boundary':None,'used':None,'reset':'pressure'})

    def test_pressure_collage_scores_once_and_three_rounds_finish(self):
        self.begin()
        battles = 0
        expect(self.page.locator('#battle')).to_be_hidden()
        for _ in range(3):
            self.page.fill('#customAnswer', '物质性 边界的消解 具身经验 本体 范式 话语 解构')
            self.page.click('#submitDefense')
            if self.page.locator('#battle').is_visible():
                battles += 1
                self.assertIn('不适值首次达到 10', self.page.locator('#battleReason').inner_text())
                expect(self.page.locator('#nextRound')).to_be_disabled()
                before = [int(value.split('/')[0]) for value in self.scores()]
                self.page.click('#battleStart')
                self.fill_collage()
                self.assertIn('使用者的停留时间', self.page.locator('#battleSentence').inner_text())
                self.assertEqual(self.page.locator('#chaosMeter').inner_text(), 'CHAOS 0')
                self.page.click('#battleSubmit')
                delta_text = self.page.locator('#battleScoreChange').inner_text()
                import re
                delta = [int(value) for value in re.findall(r'[+-]\d+', delta_text)]
                after = [int(value.split('/')[0]) for value in self.scores()]
                expected = [before[i]+delta[i] if i == 2 else max(0,before[i]+delta[i]) for i in range(4)]
                self.assertEqual(after, expected)
                self.page.evaluate("document.getElementById('battleSubmit').dispatchEvent(new Event('click'))")
                self.assertEqual([int(value.split('/')[0]) for value in self.scores()], after)
                expect(self.page.locator('#nextRound')).to_be_enabled()
            self.page.click('#nextRound')
        self.assertEqual(battles, 1)
        expect(self.page.locator('#final')).to_be_visible()
        self.assertTrue(self.page.locator('#shareCard').evaluate("canvas => canvas.toDataURL().startsWith('data:image/png')"))
        self.page.click('#restart')
        self.begin()
        self.assertEqual(self.scores(), ['0/8','0/8','0/4','0/15'])
        self.assertEqual(self.page.evaluate("testBattle.pickTrigger({discomfort:10},{depth:0})"), 'pressure')

    def test_admiration_and_surprise_show_original_tiles(self):
        self.begin()
        self.page.evaluate('Math.random = () => 0')
        self.page.fill('#customAnswer', '物质性 边界的消解 具身经验 本体 范式 话语 解构 测试 记录 反馈 使用者')
        self.page.click('#submitDefense')
        self.assertIn('欣赏型', self.page.locator('#battleReason').inner_text())
        self.page.click('#battleStart')
        self.assertEqual(self.page.locator('.slot').count(), 4)
        self.assertEqual(self.page.locator('.chip').count(), 16)
        self.fill_collage()
        self.page.click('#battleSubmit')
        expect(self.page.locator('#nextRound')).to_be_enabled()
        self.page.evaluate('Math.random = () => 0.99')
        self.page.click('#nextRound')
        self.page.evaluate('Math.random = () => 0')
        self.page.fill('#customAnswer', '好')
        self.page.click('#submitDefense')
        self.assertIn('随机突发', self.page.locator('#battleReason').inner_text())

    def test_timeout_pause_and_reset_cancel_timers(self):
        self.page.clock.install()
        self.begin()
        self.page.evaluate('Math.random = () => 0')
        self.page.fill('#customAnswer', '好')
        self.page.click('#submitDefense')
        self.page.clock.run_for(25000)
        expect(self.page.locator('#battleLive')).to_be_hidden()
        before = [int(value.split('/')[0]) for value in self.scores()]
        self.page.click('#battleStart')
        self.page.clock.run_for(3000)
        self.page.click('#battlePause')
        paused = self.page.locator('#battleTimer').inner_text()
        self.page.clock.run_for(25000)
        self.assertEqual(self.page.locator('#battleTimer').inner_text(), paused)
        self.page.click('#battlePause')
        self.page.clock.run_for(17100)
        self.assertEqual(self.page.locator('#battleTimer').inner_text(), '时间到')
        after = [int(value.split('/')[0]) for value in self.scores()]
        self.assertEqual(after, [before[0],max(0,before[1]-2),before[2]-1,before[3]+2])
        expect(self.page.locator('#nextRound')).to_be_enabled()
        expect(self.page.locator('.chip').first).to_be_disabled()
        self.page.click('#nextRound')
        self.page.fill('#customAnswer', '好')
        self.page.click('#submitDefense')
        self.page.click('#battleStart')
        self.page.evaluate('testBattle.reset()')
        self.page.clock.run_for(25000)
        expect(self.page.locator('#battle')).to_be_hidden()
        self.assertFalse(self.page.evaluate('testBattle.isPending()'))

    def test_drag_wrong_tiles_chaos_and_replacement(self):
        self.begin()
        self.page.evaluate('Math.random = () => 0')
        self.page.fill('#customAnswer', '好')
        self.page.click('#submitDefense')
        self.page.click('#battleStart')
        first = self.page.locator('.chip[data-type="opening"]').first
        first.drag_to(self.page.locator('.slot[data-slot="opening"]'))
        expect(self.page.locator('.slot[data-slot="opening"]')).to_have_class('slot filled good')
        first.click()
        self.page.click('.slot[data-slot="move"]')
        self.assertEqual(self.page.locator('#chaosMeter').inner_text(), 'CHAOS 2')
        for key in ['concept','proof']:
            self.page.locator('.chip[data-type="absurd"]').first.click()
            self.page.click(f'.slot[data-slot="{key}"]')
        self.assertEqual(self.page.locator('#chaosMeter').inner_text(), 'CHAOS 10')
        self.assertIn('暂时离席', self.page.locator('#improvStatus').inner_text())
        self.fill_collage()
        self.assertEqual(self.page.locator('#chaosMeter').inner_text(), 'CHAOS 0')
        self.page.click('#battleSubmit')
        expect(self.page.locator('#nextRound')).to_be_enabled()

    def test_seat_event_conditions_and_unique_collage_names(self):
        result = self.page.evaluate("""() => {
          const pick = DYB_CRITICS.pickSeatEvent;
          const controller = DYB_CRITICS.create();
          const names = Array.from({length:6}, () => controller.cast({name:'PROF. ORIGINAL'}).name);
          return {
            first: [pick(0,{depth:0},0.079),pick(0,{depth:0},0.08)],
            second: [pick(1,{depth:0},0.119),pick(1,{depth:0},0.12),pick(1,{depth:0},0.2)],
            final: [pick(2,{depth:0},0.119),pick(2,{depth:0},0.12),pick(2,{depth:0},0.269),pick(2,{depth:0},0.27),pick(2,{depth:0},0.35)],
            high: [pick(2,{depth:8},0.449),pick(2,{depth:8},0.45)], names
          };
        }""")
        self.assertEqual(result['first'], ['visiting',None])
        self.assertEqual(result['second'], ['meeting','visiting',None])
        self.assertEqual(result['final'], ['meeting','clockOff','clockOff','visiting',None])
        self.assertEqual(result['high'], ['visiting',None])
        self.assertEqual(len(set(result['names'])),6)
        self.assertTrue(all(' / ' in name and name != 'PROF. ORIGINAL' for name in result['names']))
        self.begin()
        first_name = self.page.locator('#professorLabel').inner_text()
        self.page.fill('#customAnswer', '好')
        self.submit_and_settle()
        self.page.evaluate('Math.random = () => 0')
        self.page.click('#nextRound')
        self.assertIn('去开会', self.page.locator('#seatEventTitle').inner_text())
        self.assertNotEqual(first_name,self.page.locator('#professorLabel').inner_text())
        self.assertEqual(self.page.locator('#roundLabel').inner_text(),'ROUND 2 / 3')
        self.page.evaluate('Math.random = () => 0.99')
        self.page.fill('#customAnswer','好')
        self.submit_and_settle()
        before = self.scores()
        self.page.evaluate('Math.random = () => 0.2')
        self.page.click('#nextRound')
        self.assertIn('下班', self.page.locator('#seatEventTitle').inner_text())
        self.assertEqual(self.scores(),before)
        expect(self.page.locator('#question')).not_to_be_empty()

    def test_visiting_critic_can_take_first_seat(self):
        self.page.evaluate('Math.random = () => 0')
        self.begin()
        self.assertIn('VISITING CRITIC', self.page.locator('#seatEventTitle').inner_text())
        self.assertIn(self.page.locator('#professorLabel').inner_text(), self.page.locator('#seatEventText').inner_text())
        self.assertEqual(self.scores(), ['0/8','0/8','0/4','0/15'])

    def test_mobile_tiles_fit_and_work_by_touch(self):
        self.context.close()
        self.context = self.browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2)
        self.page = self.context.new_page()
        self.page.set_default_timeout(5000)
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))
        self.page.goto(self.url)
        self.page.select_option('#aiProvider','local')
        self.begin()
        self.page.evaluate('Math.random = () => 0')
        self.page.fill('#customAnswer','好')
        self.page.tap('#submitDefense')
        self.page.tap('#battleStart')
        self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth > innerWidth'))
        self.fill_collage(touch=True)
        self.page.screenshot(path='/tmp/dyb-collage-mobile.png',full_page=True)
        self.page.tap('#battleSubmit')
        expect(self.page.locator('#nextRound')).to_be_enabled()
        self.assertIn('已填 4/4 槽',self.page.locator('#battleResponse').inner_text())


if __name__ == '__main__':
    unittest.main()
