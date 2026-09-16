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

if __name__=="__main__":
    unittest.main()
