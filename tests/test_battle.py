"""Browser regression checks. Run: python -m unittest discover -s tests -v.
Requires the Python playwright package and a Chromium executable.
"""
import functools
import json
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
        self.page.evaluate("window.DYB_AI_CONFIG.endpoint=''")
        self.page.click('#startGame')
        self.page.locator('#strategyMode').evaluate("el=>el.value='local'")
        self.page.locator('#aiProvider').evaluate("element => element.value = 'local'")

    def tearDown(self):
        self.assertEqual(self.errors, [])
        self.context.close()

    def begin(self):
        if self.page.locator('#career').is_visible():
            if self.page.locator('#lifeEvent').is_visible():
                self.page.locator('.life-choice[data-choice="return"], .life-choice[data-choice="ignore"], .life-choice[data-choice="decline"], .life-choice[data-choice="later"]').first.click()
            if self.page.locator('#resumeJob').count():
                self.page.click('#resumeJob')
            else:
                self.page.locator('.accept-job').first.click()
        self.page.locator('#aiProvider').evaluate("element => element.value = 'local'")
        self.page.click('#generate')
        self.page.click('#beginReview')

    def answer(self, text):
        self.page.locator('#customReply').evaluate('el=>el.open=true')
        self.page.fill('#customAnswer',text)

    def dismiss_reaction(self):
        if self.page.locator('#reactionContinue').inner_text()=='进入限时追问':
            self.page.click('#reactionContinue')
        else:
            self.page.click('#reactionDetails')

    def close_reaction(self):
        if self.page.locator('#reactionDialog').is_visible():
            self.dismiss_reaction()

    def scores(self):
        return self.page.locator('#passChecklist .check em').all_text_contents()

    def fill_collage(self, touch=False):
        for kind in ['opening', 'move', 'concept', 'proof']:
            tile = self.page.locator(f'.chip[data-type="{kind}"]').first
            if kind == 'proof':
                tile = self.page.locator('.chip[data-type="proof"]').first
            slot = self.page.locator(f'.slot[data-slot="{kind}"]')
            if touch:
                tile.tap()
            else:
                tile.click()

    def submit_and_settle(self):
        self.page.click('#submitDefense')
        self.dismiss_reaction()
        if self.page.locator('#battle').is_visible():
            self.fill_collage()
            self.page.click('#battleSubmit')
            self.close_reaction()
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
            self.answer( '物质性 边界的消解 具身经验 本体 范式 话语 解构')
            self.page.click('#submitDefense')
            self.dismiss_reaction()
            if self.page.locator('#battle').is_visible():
                battles += 1
                self.assertIn('不适值首次达到 10', self.page.locator('#battleReason').inner_text())
                expect(self.page.locator('#nextRound')).to_be_disabled()
                before = [int(value.split('/')[0]) for value in self.scores()]
                self.fill_collage()
                self.assertTrue(self.page.locator('#battleSentence').inner_text())
                self.assertEqual(self.page.locator('#chaosMeter').inner_text(), 'CHAOS 0')
                self.page.click('#battleSubmit')
                self.close_reaction()
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
        self.answer( '物质性 边界的消解 具身经验 本体 范式 话语 解构 测试 记录 反馈 使用者')
        self.page.click('#submitDefense')
        self.dismiss_reaction()
        self.assertIn('欣赏型', self.page.locator('#battleReason').inner_text())
        self.assertEqual(self.page.locator('.slot').count(), 4)
        self.assertEqual(self.page.locator('.chip').count(), 16)
        self.fill_collage()
        self.page.click('#battleSubmit')
        self.close_reaction()
        expect(self.page.locator('#nextRound')).to_be_enabled()
        self.page.evaluate('Math.random = () => 0.99')
        self.page.click('#nextRound')
        self.page.evaluate('Math.random = () => 0')
        self.answer( '好')
        self.page.click('#submitDefense')
        self.dismiss_reaction()
        self.assertIn('随机突发', self.page.locator('#battleReason').inner_text())

    def test_timeout_pause_and_reset_cancel_timers(self):
        self.page.clock.install()
        self.begin()
        self.page.evaluate('Math.random = () => 0')
        self.answer( '好')
        self.page.click('#submitDefense')
        self.dismiss_reaction()
        expect(self.page.locator('#battleLive')).to_be_visible()
        expect(self.page.locator('#battleStart')).to_be_hidden()
        before = [int(value.split('/')[0]) for value in self.scores()]
        self.page.clock.run_for(3000)
        self.page.click('#battlePause')
        paused = self.page.locator('#battleTimer').inner_text()
        self.page.clock.run_for(25000)
        self.assertEqual(self.page.locator('#battleTimer').inner_text(), paused)
        self.page.click('#battlePause')
        self.page.clock.run_for(17100)
        self.close_reaction()
        self.assertEqual(self.page.locator('#battleTimer').inner_text(), '时间到')
        after = [int(value.split('/')[0]) for value in self.scores()]
        self.assertEqual(after, [before[0],max(0,before[1]-1),before[2],before[3]+1])
        expect(self.page.locator('#nextRound')).to_be_enabled()
        expect(self.page.locator('.chip').first).to_be_disabled()
        self.page.click('#nextRound')
        self.answer( '好')
        self.page.click('#submitDefense')
        self.dismiss_reaction()
        self.page.evaluate('testBattle.reset()')
        self.page.clock.run_for(25000)
        expect(self.page.locator('#battle')).to_be_hidden()
        self.assertFalse(self.page.evaluate('testBattle.isPending()'))

    def test_single_click_places_and_replaces_tiles_without_returning_to_slots(self):
        self.begin()
        self.page.evaluate('Math.random=()=>0')
        self.answer('好')
        self.page.click('#submitDefense')
        self.dismiss_reaction()
        self.page.set_viewport_size({'width':390,'height':844})
        for kind in ['opening','move','concept','proof']:
            tile=self.page.locator('.chip[data-type="'+kind+'"]').first
            value=tile.inner_text()
            tile.click()
            expect(self.page.locator('.slot[data-slot="'+kind+'"] strong')).to_have_text(value)
        replacement=self.page.locator('.chip[data-type="concept"]').nth(1)
        value=replacement.inner_text()
        replacement.click()
        expect(self.page.locator('.slot[data-slot="concept"] strong')).to_have_text(value)
        self.assertEqual(self.page.locator('.chip.selected[data-type="concept"]').count(),1)
        self.page.locator('.chip[data-type="absurd"]').first.click()
        self.assertEqual(self.page.locator('#chaosMeter').inner_text(),'CHAOS 4')
        self.page.locator('.chip[data-type="proof"]').first.click()
        self.assertEqual(self.page.locator('#chaosMeter').inner_text(),'CHAOS 0')

    def test_live_collage_strip_stays_at_top_and_updates_without_scrolling_back(self):
        self.page.set_viewport_size({'width':390,'height':844})
        self.begin()
        self.page.evaluate('Math.random=()=>0')
        self.answer('好')
        self.page.click('#submitDefense')
        self.dismiss_reaction()
        tile=self.page.locator('.chip[data-type="proof"]').last
        text=tile.inner_text()
        tile.click()
        expect(self.page.locator('#battleAssemblyMini')).to_contain_text(text)
        self.page.locator('#wordBank').evaluate('e=>window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY+100)')
        bar=self.page.locator('#battleContext').bounding_box()
        self.assertGreaterEqual(bar['y'],-1)
        self.assertLessEqual(bar['y'],3)
        self.assertLess(bar['height'],115)
        self.assertEqual(self.page.locator('#battleProjectMini').inner_text(),self.page.locator('#reviewProject').inner_text())
        self.page.locator('#battleAssemblyPanel summary').click()
        expect(self.page.locator('#battleAssemblyFull')).to_be_visible()
        self.assertIn(text,self.page.locator('#battleAssemblyFull').inner_text())
        self.page.locator('#battleAssemblyPanel summary').click()
        self.page.screenshot(path='/tmp/dyb-live-collage-strip.png')
        self.page.select_option('#battleInputMode','free')
        self.page.fill('#battleDraft','这是完整的自由回答。')
        self.assertEqual(self.page.locator('#battleAssemblyMini').inner_text(),'这是完整的自由回答。')
        self.page.click('#battleSubmit')
        self.close_reaction()
        expect(self.page.locator('#battleContext')).to_be_hidden()

    def test_reaction_buttons_show_details_or_advance_without_bottom_navigation(self):
        self.begin()
        for round in range(3):
            self.answer('通过测试记录用户反馈。')
            self.page.click('#submitDefense')
            expect(self.page.locator('#reactionDetails')).to_be_visible()
            if round==0:
                self.page.click('#reactionDetails')
                expect(self.page.locator('#feedbackPoints')).to_have_attribute('open','')
                self.assertEqual(self.page.locator('#roundLabel').inner_text(),'ROUND 1 / 3')
                self.page.click('#nextRound')
            else:
                self.assertEqual(self.page.locator('#reactionContinue').inner_text(),'查看最终结果' if round==2 else '进入下一问')
                self.page.click('#reactionContinue')
        expect(self.page.locator('#final')).to_be_visible()

    def test_battle_details_do_not_start_timer_until_player_continues(self):
        self.begin()
        self.page.evaluate('Math.random=()=>0')
        self.answer('好')
        self.page.click('#submitDefense')
        self.assertEqual(self.page.locator('#reactionContinue').inner_text(),'进入限时追问')
        self.page.click('#reactionDetails')
        expect(self.page.locator('#battle')).to_be_hidden()
        self.assertEqual(self.page.locator('#nextRound').inner_text(),'进入限时追问')
        self.page.click('#nextRound')
        expect(self.page.locator('#battleLive')).to_be_visible()
        self.fill_collage()
        self.page.click('#battleSubmit')
        self.assertEqual(self.page.locator('#reactionContinue').inner_text(),'进入下一问')
        self.page.click('#reactionContinue')
        self.assertEqual(self.page.locator('#roundLabel').inner_text(),'ROUND 2 / 3')

    def test_drag_wrong_tiles_chaos_and_replacement(self):
        self.begin()
        self.page.evaluate('Math.random = () => 0')
        self.answer( '好')
        self.page.click('#submitDefense')
        self.dismiss_reaction()
        first = self.page.locator('.chip[data-type="opening"]').first
        first.drag_to(self.page.locator('.slot[data-slot="opening"]'))
        expect(self.page.locator('.slot[data-slot="opening"]')).to_have_class('slot filled good')
        first.drag_to(self.page.locator('.slot[data-slot="move"]'))
        self.assertEqual(self.page.locator('#chaosMeter').inner_text(), 'CHAOS 0')
        for key in ['concept','proof']:
            self.page.locator('.chip[data-type="absurd"]').first.drag_to(self.page.locator(f'.slot[data-slot="{key}"]'))
        self.assertEqual(self.page.locator('#chaosMeter').inner_text(), 'CHAOS 8')
        self.assertIn('暂时离席', self.page.locator('#improvStatus').inner_text())
        self.fill_collage()
        self.assertEqual(self.page.locator('#chaosMeter').inner_text(), 'CHAOS 0')
        self.page.click('#battleSubmit')
        self.close_reaction()
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
        self.answer( '好')
        self.submit_and_settle()
        self.page.evaluate('Math.random = () => 0')
        self.page.click('#nextRound')
        self.assertIn('去开会', self.page.locator('#seatEventTitle').inner_text())
        self.assertNotEqual(first_name,self.page.locator('#professorLabel').inner_text())
        self.assertEqual(self.page.locator('#roundLabel').inner_text(),'ROUND 2 / 3')
        self.page.evaluate('Math.random = () => 0.99')
        self.answer('好')
        self.submit_and_settle()
        before = self.scores()
        self.page.evaluate('Math.random = () => 0.2')
        self.page.click('#nextRound')
        self.assertIn('下班', self.page.locator('#seatEventTitle').inner_text())
        self.assertEqual(self.scores(),before)
        expect(self.page.locator('#question')).not_to_be_empty()

    def test_art_erase_feedback_and_statement_never_review_architecture(self):
        self.page.select_option('#pack','art')
        self.page.fill('#project','把开幕致辞循环播放八小时')
        self.page.click('#generate')
        statement=self.page.locator('#generated').inner_text()
        self.assertIn('观众',statement)
        self.assertNotIn('空间实践',statement)
        self.page.click('#beginReview')
        self.assertNotIn('DANIEL SIZARO',self.page.locator('#professorLabel').inner_text())
        self.answer('如果去掉一轮重复，取消这次播放，删除自动解释的说明，观众可以通过观看记录媒介与体验的变化。')
        self.page.click('#submitDefense')
        feedback=self.page.locator('#feedback').inner_text()
        self.assertNotIn('建筑本身',feedback)
        self.assertTrue('作品与观看的关系' in feedback or '媒介与呈现方式' in feedback)
        self.assertIn('把开幕致辞循环播放八小时',feedback)
        self.page.locator('#reactionDialog').screenshot(path='/tmp/dyb-art-feedback.png')
        self.dismiss_reaction()

    def test_absurd_project_drawings_follow_selection_and_stay_above_review(self):
        projects=self.page.evaluate('DYB_PROJECT_DRAWINGS.items.map(item=>item.project)')
        for project in projects:
            self.page.select_option('#drawingProject',project)
            self.assertEqual(self.page.input_value('#project'),project)
            expect(self.page.locator('#setupDrawing')).to_be_visible()
            self.assertTrue(self.page.locator('#setupDrawing img').evaluate('img=>img.complete&&img.naturalWidth>0'))
        self.page.click('#generate')
        expect(self.page.locator('#statementDrawing')).to_be_visible()
        self.assertEqual(self.page.locator('#statementProject').inner_text(),projects[-1])
        self.page.locator('#statementDrawing').screenshot(path='/tmp/dyb-absurd-tower.png')
        self.page.click('#beginReview')
        expect(self.page.locator('#reviewDrawing')).to_be_visible()
        self.assertEqual(self.page.locator('#reviewDrawing img').get_attribute('alt'),self.page.locator('#statementDrawing img').get_attribute('alt'))
        diagram=self.page.locator('#reviewDrawing').bounding_box()
        question=self.page.locator('#question').bounding_box()
        self.assertLess(diagram['y'],question['y'])
        self.page.set_viewport_size({'width':390,'height':844})
        self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth>innerWidth'))
        self.page.locator('#reviewDrawing').screenshot(path='/tmp/dyb-absurd-tower-mobile.png')
        self.page.reload()
        self.page.click('#startGame')
        self.page.select_option('#drawingProject',projects[0])
        self.page.fill('#project','我自己改写的项目')
        expect(self.page.locator('#setupDrawing')).to_be_hidden()
        self.page.select_option('#pack','art')
        expect(self.page.locator('#drawingProjectPicker')).to_be_hidden()

    def test_professor_name_does_not_change_without_a_seat_event(self):
        self.page.evaluate('Math.random=()=>0.99')
        self.begin()
        name=self.page.locator('#professorLabel').inner_text()
        for _ in range(2):
            self.answer('通过原型测试和对照记录判断实际行动。')
            self.submit_and_settle()
            self.page.click('#nextRound')
            self.assertEqual(self.page.locator('#professorLabel').inner_text(),name)
            expect(self.page.locator('#seatEvent')).to_be_hidden()

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
        self.page.evaluate("window.DYB_AI_CONFIG.endpoint=''")
        self.page.click('#startGame')
        self.page.locator('#strategyMode').evaluate("el=>el.value='local'")
        self.page.locator('#aiProvider').evaluate("element => element.value = 'local'")
        self.begin()
        self.page.evaluate('Math.random = () => 0')
        self.answer('好')
        self.page.tap('#submitDefense')
        self.page.tap('#reactionContinue')
        self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth > innerWidth'))
        self.fill_collage(touch=True)
        self.page.screenshot(path='/tmp/dyb-collage-mobile.png',full_page=True)
        self.page.tap('#battleSubmit')
        self.close_reaction()
        expect(self.page.locator('#nextRound')).to_be_enabled()
        self.assertIn('回应问题、概念与证据',self.page.locator('#battleResponse').inner_text())


    def test_career_resume_resources_and_blacklist_reset(self):
        self.page.evaluate("localStorage.setItem('dyb-play-v1',JSON.stringify({version:1,mode:'career',invitation:'accepted',history:[],sequence:0}))")
        self.page.reload()
        self.page.click('#startGame')
        self.page.locator('#strategyMode').evaluate("el=>el.value='local'")
        self.page.screenshot(path='/tmp/dyb-club-desktop.png',full_page=True)
        self.page.locator('.accept-job').first.click()
        self.page.fill('#project','这份稿子必须保存')
        self.page.click('#backToClub')
        self.page.reload()
        self.page.click('#startGame')
        self.page.locator('#strategyMode').evaluate("el=>el.value='local'")
        expect(self.page.locator('#resumeJob')).to_be_visible()
        self.assertIn('Token 12',self.page.locator('#careerStrip').inner_text())
        self.page.click('#resumeJob')
        self.assertEqual(self.page.input_value('#project'),'这份稿子必须保存')
        self.page.click('#backToClub')
        for attempt in range(3):
            if attempt:
                self.page.locator('.accept-job').first.click()
                self.page.click('#backToClub')
            self.page.click('#abandonJob')
            self.page.click('#abandonJob')
        expect(self.page.locator('#accountClosed')).to_be_visible()
        self.page.click('#resetCareer')
        self.page.click('#resetCareer')
        self.assertIn('Token 18',self.page.locator('#careerStrip').inner_text())
        expect(self.page.locator('.accept-job').first).to_be_enabled()

    def test_share_transcript_preserves_all_rounds_battle_and_actual_critics(self):
        result=self.page.evaluate("""() => {
          const history=[1,2,3].map(i=>({professor:'虚构教授 '+i,question:'第'+i+'题：为什么删墙？',answer:('第'+i+'轮回答：墙消失了，关系没有消失。').repeat(15)+'回答结束'+i,response:'神秘赞许'+i}));
          history[1].battle={question:'补充问题：谁承担代价？',answer:'补充回答全文',response:'追问评语'};
          const data={project:'删掉一面墙',verdict:{title:'通关',passed:true},scores:{depth:12,confidence:12,substance:8,discomfort:9},critique:'神秘赞许',defense:'我选择删墙',history,url:'test'};
          const poster=document.getElementById('shareCard'),record=document.getElementById('shareRecord');
          const original=poster.getContext('2d').fillText,signatures=[];poster.getContext('2d').fillText=function(t,...args){signatures.push(t);return original.call(this,t,...args)};
          DYB_SHARE_CARD.draw(poster,data);const layout=DYB_SHARE_CARD.drawRecord(record,data);const long=DYB_SHARE_CARD.combine(poster,record);
          return {rounds:layout.rounds,content:layout.painted.join(''),signatures,height:long.height,expectedHeight:poster.height+record.height};
        }""")
        self.assertEqual(result['rounds'],3)
        for i in range(1,4):
            self.assertIn('回答结束'+str(i),result['content'])
            self.assertIn('第'+str(i)+'题',result['content'])
            self.assertIn('神秘赞许'+str(i),result['content'])
            self.assertIn('虚构教授 '+str(i),result['signatures'])
        self.assertIn('补充问题：谁承担代价？',result['content'])
        self.assertIn('补充回答全文',result['content'])
        self.assertEqual(result['height'],result['expectedHeight'])

    def test_share_card_keeps_long_multilingual_defense(self):
        layout=self.page.evaluate(r"""() => {
            const defense=('这是完整的现场答辩。 Mixed English words must stay visible. 🐒\n').repeat(55)+'最后一句必须完整显示 END OF DEFENCE';
            const canvas=document.getElementById('shareCard');
            const draw=canvas.getContext('2d').fillText;
            const painted=[];
            canvas.getContext('2d').fillText=function(text,...args){painted.push(text);return draw.call(this,text,...args)};
            const result=DYB_SHARE_CARD.draw(canvas,{project:'超长项目标题'.repeat(12),verdict:{title:'学术嘴替通关',passed:true},scores:{depth:15,confidence:12,substance:8,discomfort:6},critique:'教授说下一次带证据。'.repeat(12),defense,careerTitle:'资深嘴替',url:'defend-your-bullshit'});
            return {...result,complete:result.defenseLines.join('').replace(/\s/g,'')===defense.replace(/\s/g,''),painted:result.defenseLines.every(line=>painted.includes(line)),png:canvas.toDataURL()};
        }""")
        self.assertTrue(layout['complete'])
        self.assertTrue(layout['painted'])
        self.assertEqual(layout['defenseFont'],20)
        self.assertGreater(layout['height'],1350)
        self.assertGreater(layout['footerY'],layout['defenseBottom'])
        import base64
        Path('/tmp/dyb-full-defense-card.png').write_bytes(base64.b64decode(layout['png'].split(',')[1]))

        preview=self.page.evaluate("""() => {
            const canvas=document.getElementById('shareCard');
            DYB_SHARE_CARD.draw(canvas,{project:'把三块石头堆起来，作为一种未完成的公共空间',verdict:{title:'MASTER OF STRATEGIC AMBIGUITY',passed:true},scores:{depth:17,confidence:16,substance:8,discomfort:11},critique:'你居然提供了可检验的内容。委员会对此表示不适。这个概念可以继续，但下次请带一点真正的证据。',defense:'我们会通过原型测试，记录不同人在现场的停留路径，并比较改动前后的使用情况。空间不是结论，而是一种等待被使用的关系。',careerTitle:'学术嘴替',url:'ginagina19992023.github.io/defend-your-bullshit/'});
            return canvas.toDataURL();
        }""")
        Path('/tmp/dyb-doodle-card.png').write_bytes(base64.b64decode(preview.split(',')[1]))


    def test_pre_scenarios_and_unlocked_theme_reach_review(self):
        self.page.evaluate("localStorage.setItem('dyb-play-v1',JSON.stringify({version:1,mode:'career',invitation:'accepted',history:[],sequence:0}))")
        self.page.reload()
        self.page.click('#startGame')
        self.page.locator('#strategyMode').evaluate("el=>el.value='local'")
        self.page.evaluate("""() => {
            const saved=JSON.parse(localStorage.getItem('dyb-career-v1'));
            saved.passes=4;saved.xp=45;saved.tier=2;saved.offers=[];
            localStorage.setItem('dyb-career-v1',JSON.stringify(saved));
        }""")
        self.page.reload()
        self.page.click('#startGame')
        self.page.locator('#strategyMode').evaluate("el=>el.value='local'")
        self.assertEqual(self.page.locator('.accept-job').count(),3)
        self.page.locator('.accept-job').nth(1).click()
        self.assertEqual(self.page.input_value('#pack'),'art')
        self.page.locator('#aiProvider').evaluate("element => element.value = 'local'")
        self.page.click('#generate')
        self.page.click('#beginReview')
        expect(self.page.locator('#question')).to_be_visible()
        self.assertTrue(self.page.locator('#question').inner_text())
        self.page.evaluate("""() => {
            const saved=JSON.parse(localStorage.getItem('dyb-career-v1'));
            saved.active=null;saved.offers=[];saved.event=null;
            localStorage.setItem('dyb-career-v1',JSON.stringify(saved));
            Math.random=()=>0.3;
        }""")
        # Persistent reload creates a fresh board; then insert the required PRE in its first offer.
        self.page.reload()
        self.page.click('#startGame')
        self.page.locator('#strategyMode').evaluate("el=>el.value='local'")
        self.page.evaluate("""() => {
            const saved=JSON.parse(localStorage.getItem('dyb-career-v1'));
            saved.offers[0].scenario=DYB_CAREER.scenarios.find(s=>s.id==='evidence');
            localStorage.setItem('dyb-career-v1',JSON.stringify(saved));
        }""")
        self.page.reload()
        self.page.click('#startGame')
        self.page.locator('#strategyMode').evaluate("el=>el.value='local'")
        self.begin()
        self.assertIn('依据',self.page.locator('#question').inner_text())
        self.assertEqual(self.scores(),['0/8','0/8','0/4','1/15'])


    def test_simple_history_decline_invitation_and_repeat_without_cost(self):
        expect(self.page.locator('#setup')).to_be_visible()
        self.assertFalse(self.page.locator('#careerStrip').is_visible())
        self.begin()
        for _ in range(3):
            self.answer('好')
            self.page.click('#submitDefense')
            self.dismiss_reaction()
            self.page.click('#nextRound')
        expect(self.page.locator('#careerInvitation')).to_be_visible()
        self.page.click('#declineInvitation')
        self.page.click('#restart')
        self.page.click('#viewHistory')
        expect(self.page.locator('#sessionHistory')).to_be_visible()
        self.assertEqual(self.page.locator('#historyList details').count(),1)
        self.page.locator('#historyList summary').click()
        self.assertIn('ROUND 3',self.page.locator('#historyList').inner_text())
        self.page.click('#historyBack')
        self.begin()
        self.assertEqual(self.scores(),['0/8','0/8','0/4','0/15'])
        for _ in range(3):
            self.answer('好')
            self.page.click('#submitDefense')
            self.dismiss_reaction()
            self.page.click('#nextRound')
        self.assertFalse(self.page.locator('#careerInvitation').is_visible())
        self.assertEqual(self.page.evaluate("JSON.parse(localStorage.getItem('dyb-play-v1')).history.length"),2)
        self.assertEqual(self.page.evaluate("JSON.parse(localStorage.getItem('dyb-career-v1')).tokens"),18)
        self.page.reload()
        self.page.click('#startGame')
        self.page.locator('#strategyMode').evaluate("el=>el.value='local'")
        expect(self.page.locator('#setup')).to_be_visible()

    def test_accept_invitation_and_switch_back_preserves_career(self):
        self.begin()
        for _ in range(3):
            self.answer('好')
            self.page.click('#submitDefense')
            self.dismiss_reaction()
            self.page.click('#nextRound')
        self.page.click('#acceptInvitation')
        expect(self.page.locator('#career')).to_be_visible()
        self.page.locator('.accept-job').first.click()
        self.page.click('#backToClub')
        self.page.click('#returnSimple')
        expect(self.page.locator('#setup')).to_be_visible()
        self.page.click('#enterCareer')
        expect(self.page.locator('#resumeJob')).to_be_visible()
        self.assertIn('Token 12',self.page.locator('#careerStrip').inner_text())


    def test_welcome_help_and_optional_corner_settings(self):
        self.page.goto(self.url)
        self.page.evaluate("window.DYB_AI_CONFIG.endpoint=''")
        expect(self.page.locator('#welcome')).to_be_visible()
        self.assertFalse(self.page.locator('#setup').is_visible())
        self.page.click('#startGame')
        self.page.locator('#strategyMode').evaluate("el=>el.value='local'")
        expect(self.page.locator('#setup')).to_be_visible()
        self.assertFalse(self.page.locator('#helpDialog').is_visible())
        self.assertFalse(self.page.locator('#aiProvider').is_visible())
        self.page.click('#helpToggle')
        expect(self.page.locator('#helpDialog')).to_be_visible()
        self.page.keyboard.press('Escape')
        self.page.click('#optionalToggle')
        expect(self.page.locator('#aiProvider')).to_be_visible()
        self.page.select_option('#aiProvider','local')
        self.page.keyboard.press('Escape')
        self.page.click('#generate')
        expect(self.page.locator('#statement')).to_be_visible()
        self.assertFalse(self.page.locator('#optionalDock').is_visible())
        self.page.set_viewport_size({'width':390,'height':844})
        self.page.goto(self.url)
        self.page.evaluate("window.DYB_AI_CONFIG.endpoint=''")
        self.page.click('#startGame')
        self.page.locator('#strategyMode').evaluate("el=>el.value='local'")
        self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth > innerWidth'))
        self.page.screenshot(path='/tmp/dyb-settings-mobile.png',full_page=True)


    def test_battle_free_answer_grades_content_and_submit_stays_in_view(self):
        self.page.set_viewport_size({'width':390,'height':844})
        self.begin()
        self.page.evaluate("""() => {
          window.battleResults=[];
          testBattle.open('surprise','TEST','PROJECT',answer=>({scores:{depth:2,confidence:1,substance:3,discomfort:0},reason:'证据：'+answer}),result=>battleResults.push(result));
        }""")
        self.page.select_option('#battleInputMode','free')
        self.page.fill('#battleDraft','通过观察三位使用者，对比改动前后的停留时间。')
        self.page.locator('.chip[data-type="opening"]').first.click()
        self.page.click('.slot[data-slot="proof"]')
        rect=self.page.locator('#battleSubmit').bounding_box()
        self.assertLessEqual(rect['y']+rect['height'],844)
        self.assertGreaterEqual(rect['y'],0)
        self.page.click('#battleSubmit')
        self.close_reaction()
        result=self.page.evaluate('battleResults[0]')
        self.assertEqual(result['answer'],'通过观察三位使用者，对比改动前后的停留时间。')
        self.assertEqual(result['scores'],{'depth':2,'confidence':1,'substance':3,'discomfort':0})
        self.assertNotIn('放对',result['response'])
        self.page.evaluate("""() => testBattle.open('surprise','TEST','PROJECT',answer=>({scores:{depth:2,confidence:1,substance:3,discomfort:0},reason:'证据：'+answer}),result=>battleResults.push(result))""")
        self.fill_collage()
        self.page.click('#battleSubmit')
        self.close_reaction()
        self.assertEqual(self.page.evaluate('battleResults[1].scores'),result['scores'])

    def test_unanchored_ai_poetry_falls_back_to_relevant_local_feedback(self):
        self.page.locator('#aiAppKey').evaluate("el=>el.value='pk_testfixture'")
        self.page.route('https://gen.pollinations.ai/**',lambda route:route.fulfill(status=200,content_type='application/json',body=json.dumps({'text':'若无人审视，那剧烈航向的空洞仅剩我靠近屋顶长椅的碎影。'})))
        self.begin()
        self.page.locator('#aiProvider').evaluate("el=>el.value='pollinations'")
        self.answer('我们记录了使用者路径，并通过测试比较改动前后的时间。')
        self.page.click('#submitDefense')
        self.dismiss_reaction()
        expect(self.page.locator('#feedback')).to_contain_text('你说「')
        self.assertNotIn('剧烈航向',self.page.locator('#feedback').inner_text())


    def test_voice_transcript_is_editable_and_late_results_are_ignored(self):
        self.page.add_init_script("""window.SpeechRecognition=class {
          constructor(){window.fakeVoice=this}
          start(){} abort(){this.aborted=true}
        }""")
        self.page.reload()
        self.page.click('#startGame')
        self.page.locator('#strategyMode').evaluate("el=>el.value='local'")
        self.begin()
        self.page.evaluate("""() => testBattle.open('surprise','TEST','PROJECT',answer=>({scores:{depth:1,confidence:1,substance:1,discomfort:0},reason:answer}),result=>window.voiceResult=result)""")
        self.page.select_option('#battleInputMode','free')
        self.page.click('#battleVoice')
        self.page.evaluate("fakeVoice.onresult({results:[[{transcript:'通过观察记录使用者路径'}]]})")
        self.assertEqual(self.page.input_value('#battleDraft'),'通过观察记录使用者路径')
        self.page.fill('#battleDraft','通过观察记录使用者路径，并对比测试结果')
        self.page.click('#battleSubmit')
        self.close_reaction()
        self.assertEqual(self.page.evaluate('voiceResult.answer'),'通过观察记录使用者路径，并对比测试结果')
        self.assertTrue(self.page.evaluate('fakeVoice.aborted'))
        self.page.evaluate("fakeVoice.onresult({results:[[{transcript:'晚到的语音'}]]})")
        self.assertNotIn('晚到',self.page.input_value('#battleDraft'))


    def test_battle_is_a_contextual_critic_question_before_timer_starts(self):
        self.begin()
        self.page.evaluate("Math.random=()=>0")
        self.answer('物质性 边界的消解 具身经验 本体 范式 话语 解构 测试 记录 反馈 使用者')
        self.page.click('#submitDefense')
        self.dismiss_reaction()
        expect(self.page.locator('#battleQuestion')).to_be_visible()
        question=self.page.locator('#battleQuestion').inner_text()
        self.assertIn('你刚才说',question)
        self.assertIn('物质性',question)
        for word in ['磁条','拼贴','词条','拼一句']:
            self.assertNotIn(word,question)
        expect(self.page.locator('#battleLive')).to_be_visible()
        expect(self.page.locator('#battleStart')).to_be_hidden()
        self.assertEqual(self.page.locator('#battleQuestion').inner_text(),question)


    def test_feedback_reason_and_original_are_separate_without_repetition(self):
        self.begin()
        self.answer('我承认失败，也许不能证明形式成立，无法解释这个决定。')
        self.page.click('#submitDefense')
        self.dismiss_reaction()
        feedback=self.page.locator('#feedback').inner_text()
        reason=self.page.locator('#feedbackReason').text_content()
        self.assertNotIn('评委听到',feedback)
        self.assertNotIn('。。',feedback+reason)
        self.assertNotIn('。；',reason)
        expect(self.page.locator('#feedbackReason')).to_be_visible()
        self.page.locator('#feedbackPoints summary').click()
        expect(self.page.locator('#feedbackReason')).to_be_hidden()
        self.page.locator('#feedbackPoints summary').click()
        expect(self.page.locator('#feedbackReason')).to_be_visible()
        self.page.locator('#feedbackOriginal summary').click()
        self.assertEqual(self.page.locator('#submittedAnswer').inner_text(),'我承认失败，也许不能证明形式成立，无法解释这个决定。')


    def test_compact_strategies_and_immediate_reaction_dialog(self):
        self.begin()
        self.page.set_viewport_size({'width':390,'height':844})
        self.page.locator('.strategy').last.click()
        self.assertTrue(self.page.locator('.strategy span').last.is_visible())
        self.assertTrue(self.page.locator('#reviewFace').inner_text())
        rect=self.page.locator('#submitDefense').bounding_box()
        self.assertGreaterEqual(rect['y'],0)
        self.assertLessEqual(rect['y']+rect['height'],844)
        self.page.screenshot(path='/tmp/dyb-compact-review.png',full_page=True)
        self.page.click('#submitDefense')
        expect(self.page.locator('#reactionDialog')).to_be_visible()
        self.page.wait_for_timeout(650)
        self.page.screenshot(path='/tmp/dyb-review-reaction.png')
        expect(self.page.locator('#reactionContinue')).to_be_enabled()
        self.assertTrue(self.page.locator('#reactionAccessible').text_content())
        self.dismiss_reaction()
        expect(self.page.locator('#reactionDialog')).to_be_hidden()


    def test_unconfigured_online_ai_uses_question_bound_offline_answer_without_legacy_requests(self):
        requests=[]
        self.page.on('request',lambda request:requests.append(request.url))
        self.page.locator('#strategyMode').evaluate("el=>el.value='ai'")
        self.begin()
        expect(self.page.locator('#strategyDraftStatus')).to_contain_text('在线 AI 尚未连接')
        self.assertFalse(any('text.pollinations.ai' in url for url in requests))
        self.assertFalse(any('gen.pollinations.ai' in url for url in requests))
        answer=self.page.locator('#strategyPreview').inner_text()
        self.assertNotIn(self.page.locator('#reviewProject').inner_text(),answer)
        self.assertLessEqual(len(answer),220)
        expect(self.page.locator('#submitDefense')).to_be_enabled()

    def test_ai_connection_controls_test_new_api_and_report_invalid_authorization(self):
        self.page.click('#optionalToggle')
        self.page.locator('.ai-connection-settings summary').click()
        self.page.fill('#aiAppKey','pk_testfixture')
        seen=[]
        def respond(route):
            seen.append(route.request.url)
            route.fulfill(status=401,content_type='application/json',body='{"error":"unauthorized"}')
        self.page.route('https://gen.pollinations.ai/**',respond)
        self.page.click('#testAiConnection')
        expect(self.page.locator('#aiConnectionStatus')).to_contain_text('接口授权无效')
        self.assertTrue(seen)
        self.assertTrue(all(url=='https://gen.pollinations.ai/v1/chat/completions' for url in seen))
        self.assertNotIn('pk_testfixture',self.page.evaluate('JSON.stringify(localStorage)'))
        self.page.locator('[data-close="optionalDialog"]').click()

    def test_selected_strategy_uses_fresh_ai_draft_and_submits_that_text(self):
        self.begin()
        project=self.page.input_value('#project')
        self.page.locator('#strategyMode').evaluate("el=>el.value='ai'")
        counter={'value':0}
        def respond(route):
            counter['value']+=1
            route.fulfill(status=200,content_type='application/json',body=json.dumps({'text':project+'：这是第'+str(counter['value'])+'种论证。我们计划对照原来的办法与改变后的使用者观看路径，记录具体行动、时间和重复体验。谁承担额外代价，谁都可以拒绝并要求修改。如果测试没有区别，就撤回它不可替代的判断。身体不负责替概念签到。'}))
        self.page.locator('#aiAppKey').evaluate("el=>el.value='pk_testfixture'")
        self.page.route('https://gen.pollinations.ai/**',respond)
        self.answer('这是之前写过但没有采用的自由回答。')
        self.page.locator('.strategy').first.click()
        expect(self.page.locator('#strategyDraftStatus')).to_contain_text('AI 现编')
        first=self.page.locator('#strategyPreview').inner_text()
        self.assertIn(project,first)
        self.page.click('#rewriteStrategy')
        expect(self.page.locator('#strategyPreview')).not_to_have_text(first)
        expect(self.page.locator('#submitDefense')).to_be_enabled()
        final=self.page.locator('#strategyPreview').inner_text()
        self.page.click('#submitDefense')
        expect(self.page.locator('#reactionDialog')).to_be_visible()
        self.dismiss_reaction()
        self.assertEqual(self.page.locator('#submittedAnswer').text_content(),final)
        self.assertNotIn('这不是单纯',final)

    def test_new_selection_discards_late_ai_draft(self):
        self.begin()
        self.page.locator('#strategyMode').evaluate("el=>el.value='ai'")
        self.page.locator('#aiAppKey').evaluate("el=>el.value='pk_testfixture'")
        self.page.route('https://gen.pollinations.ai/**',lambda route:route.fulfill(status=503,body='unavailable'))
        self.page.locator('.strategy').first.click()
        expect(self.page.locator('#strategyDraftStatus')).to_contain_text('离线回答')
        expect(self.page.locator('#submitDefense')).to_be_enabled()
        self.assertNotIn(self.page.input_value('#project'),self.page.locator('#strategyPreview').inner_text())
        self.assertLessEqual(len(self.page.locator('#strategyPreview').inner_text()),220)


    def test_current_project_remains_visible_while_selecting_and_scrolling(self):
        self.begin()
        project=self.page.input_value('#project')
        expect(self.page.locator('#reviewProject')).to_have_text(project)
        self.page.set_viewport_size({'width':390,'height':844})
        self.page.locator('.strategy').last.click()
        expect(self.page.locator('#submitDefense')).to_be_enabled()
        self.page.evaluate('window.scrollBy(0,600)')
        title=self.page.locator('#reviewProject').bounding_box()
        self.assertGreaterEqual(title['y'],0)
        self.assertLess(title['y']+title['height'],844)
        expect(self.page.locator('#reviewProject')).to_have_text(project)


    def test_taste_changes_scores_and_is_disclosed_only_in_triggered_feedback(self):
        self.page.add_init_script("""Object.defineProperty(window,'DYB_CRITICS',{configurable:true,set(module){
          const cast=module.create;
          module.create=(...args)=>{const critics=cast(...args);const original=critics.cast;critics.cast=prof=>({...original(prof),bias:'memory',topic:'memory',preference:{depth:0,confidence:0,substance:0,discomfort:0}});critics.replace=()=>null;return critics};
          Object.defineProperty(window,'DYB_CRITICS',{value:module});
        }})""")
        self.page.reload()
        self.page.click('#startGame')
        self.page.locator('#strategyMode').evaluate("el=>el.value='local'")
        self.begin()
        self.assertNotIn('加分',self.page.locator('#reviewBias').inner_text())
        self.assertEqual(self.page.locator('.taste-details').count(),0)
        self.answer('我们用身体感知旧墙的痕迹，比较记忆和时间如何改变地方的观看路径。不是简单怀旧，而是记录参与者的行动。')
        self.page.click('#submitDefense')
        self.dismiss_reaction()
        self.assertEqual(self.page.locator('#feedback').inner_text().count('命中评委偏好'),1)
        self.assertNotIn('命中评委偏好',self.page.locator('#feedbackReason').text_content())
        self.page.click('#nextRound')
        self.answer('我们不必回答时间的问题，换个概念就好了。')
        self.page.click('#submitDefense')
        self.dismiss_reaction()
        expect(self.page.locator('#feedback')).to_contain_text('触怒偏好')
        expect(self.page.locator('#feedback')).to_contain_text('不适 +2')


    def test_long_press_voice_fills_last_strategy_cell_and_transcribes_to_draft(self):
        self.page.add_init_script("""
          window.normalMicStops=0;
          Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:async()=>({getTracks:()=>[{stop(){normalMicStops++}}]})}});
          window.MediaRecorder=class {static isTypeSupported(){return true}constructor(){this.state='inactive';this.mimeType='audio/webm'}start(){this.state='recording'}stop(){this.state='inactive';this.ondataavailable?.({data:new Blob(['audio'],{type:this.mimeType})});this.onstop?.()}};
          window.SpeechRecognition=class {constructor(){window.normalSpeech=this}start(){}stop(){this.onend?.()}abort(){}};
        """)
        self.page.reload()
        self.page.click('#startGame')
        self.page.locator('#strategyMode').evaluate("el=>el.value='local'")
        self.begin()
        expect(self.page.locator('#normalVoiceChoice')).to_be_visible()
        self.assertEqual(self.page.locator('#strategies>button').count(),8)
        self.page.locator('#normalVoiceChoice').hover()
        self.page.mouse.down()
        self.page.wait_for_timeout(450)
        self.page.mouse.up()
        expect(self.page.locator('#normalVoiceBar')).to_be_visible()
        self.page.evaluate("normalSpeech.onresult({results:[[{transcript:'我们记录使用者的路径，比较材料、记忆与时间如何改变体验。'}]]})")
        self.page.click('#normalVoiceFinish')
        expect(self.page.locator('#normalVoiceBar')).to_be_hidden()
        expect(self.page.locator('#strategyPreview')).to_have_text('我们记录使用者的路径，比较材料、记忆与时间如何改变体验。')
        expect(self.page.locator('#normalVoiceAudio')).to_be_visible()
        self.assertGreater(self.page.evaluate('normalMicStops'),0)
        self.page.click('#submitDefense')
        self.dismiss_reaction()
        self.assertEqual(self.page.locator('#submittedAnswer').text_content(),'我们记录使用者的路径，比较材料、记忆与时间如何改变体验。')

    def test_denied_voice_permission_keeps_existing_draft(self):
        self.page.add_init_script("Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:async()=>{throw new DOMException('denied','NotAllowedError')}}})")
        self.page.reload()
        self.page.click('#startGame')
        self.page.locator('#strategyMode').evaluate("el=>el.value='local'")
        self.begin()
        expect(self.page.locator('#submitDefense')).to_be_enabled()
        original=self.page.locator('#strategyPreview').inner_text()
        self.page.locator('#normalVoiceChoice').hover()
        self.page.mouse.down()
        self.page.wait_for_timeout(450)
        self.page.mouse.up()
        expect(self.page.locator('#strategyDraftStatus')).to_contain_text('没有获得麦克风授权')
        self.assertEqual(self.page.locator('#strategyPreview').inner_text(),original)
        expect(self.page.locator('#submitDefense')).to_be_enabled()


if __name__ == '__main__':
    unittest.main()
