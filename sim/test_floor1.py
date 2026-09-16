import unittest, random
from . import core
from .run import run_floor_mode

class TestFloor1Simulation(unittest.TestCase):
    def test_opposites(self):
        self.assertEqual(core.OPPOSITES,{1:6,2:5,3:4,4:3,5:2,6:1})

    def test_spoils_bands(self):
        self.assertEqual([core.spoils_band(x) for x in [2,4,5,7,8,10,11,12]],[1,1,2,2,3,3,4,4])

    def test_instincts(self):
        self.assertEqual(core.lock_enemy([1,6,4],"STRONGEST"),[6,4])
        self.assertEqual(core.lock_enemy([2,5,6],"WIDE"),[6,2])
        self.assertEqual(core.lock_enemy([2,3,6],"TIGHT"),[2,3])
        self.assertEqual(core.lock_enemy([2,5,3],"ODD"),[5,3])

    def test_final_blow_capture(self):
        scores=[]
        self.assertEqual(core.update_spoils(scores,11,"final"),11)
        self.assertEqual(core.update_spoils(scores,6,"final"),6)
        self.assertEqual(core.update_spoils([11],6,"best"),11)

    def test_seed_reproduction(self):
        self.assertEqual(run_floor_mode(1234,"balanced","final"),run_floor_mode(1234,"balanced","final"))

    def test_simulation_tuning(self):
        self.assertEqual(core.ELITES["seal_bearer"]["hp"],8)
        self.assertEqual(core.ELITES["seal_bearer"]["instinct"],"STRONGEST")
        self.assertEqual(core.current_boss_state(3)[2],"STRONGEST")

    def test_work_apron_reduces_small_margin_repeatedly(self):
        p=core.Player();p.gear["armor"]="work_apron"
        result=core.evaluate_candidate(p,{"rule":None},[4,4,1,1],(0,1),[5,5],None,None,False,None,True)
        self.assertEqual(result["margin"],-2)
        self.assertEqual(result["incoming"],1)

    def test_counterfeit_seal_sets_to_five(self):
        p=core.Player();p.contraband=["counterfeit_seal"]
        variants=core.self_variants([1,2,3,4],None,{"bump":0,"flip":0,"copy":0,"transmute":0},p)
        self.assertTrue(any(action and action[0]=="set5" and 5 in dice for dice,action in variants))

    def test_wire_cutter_lowers_highest_by_two(self):
        p=core.Player();p.contraband=["wire_cutter"]
        variants=core.enemy_variants([6,4],{"hidden_hand":0},p)
        self.assertIn(([4,4],("wire_cutter",0)),variants)

if __name__=="__main__":
    unittest.main()
