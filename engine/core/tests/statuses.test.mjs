import assert from "node:assert/strict";
import test from "node:test";
import {applyStatus,createStatusState,statusRegistryV0,tickRoundStatuses} from "../dist/index.js";

test("statuses stack to cap and expire deterministically",()=>{const marked=statusRegistryV0["status:player:marked"];let state=createStatusState();state=applyStatus(state,marked,2,2);state=applyStatus(state,marked,2,2);assert.equal(state.player[0].stacks,3);assert.equal(state.player[0].roundsRemaining,2);state=tickRoundStatuses(state,statusRegistryV0);assert.equal(state.player[0].roundsRemaining,1);state=tickRoundStatuses(state,statusRegistryV0);assert.equal(state.player.length,0);});
