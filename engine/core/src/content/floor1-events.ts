import type { EventDefinition } from "../events/events.js";

export const unnumberedDoor: EventDefinition = {
  id:"thresholds:unnumbered-door",
  choices:[
    {id:"force",actions:[{type:"DAMAGE",amount:3},{type:"RANDOM_ITEM_OFFER",categories:["ARTIFACT"],tier:2}]},
    {id:"knock",actions:[{type:"ROLL_D6_TABLE",entries:[
      {min:1,max:2,actions:[{type:"DAMAGE",amount:2}]},
      {min:3,max:4,actions:[{type:"ADD_COINS",amount:4}]},
      {min:5,max:6,actions:[{type:"RANDOM_ITEM_OFFER",categories:["ARTIFACT"],tier:1}]},
    ]}]},
    {id:"leave",actions:[]},
  ],
};

export const talkingBoard1891: EventDefinition = {
  id:"thresholds:talking-board-1891",
  choices:[
    {id:"ask-ahead",actions:[{type:"REVEAL_NEXT_ENCOUNTER"}]},
    {id:"move-pointer",actions:[{type:"RANDOM_ITEM_OFFER",categories:["CONTRABAND"],tier:1,forced:true},{type:"DAMAGE",amount:1}]},
    {id:"put-back",actions:[{type:"ADD_COINS",amount:2}]},
  ],
};

export const lostPropertyOffice: EventDefinition = {
  id:"thresholds:lost-property-office",
  choices:[
    {id:"file-item",actions:[{type:"REMOVE_SELECTED_FOR_VALUE",multiplier:.75}]},
    {id:"claim",actions:[{type:"SPEND_COINS",amount:4},{type:"RANDOM_ITEM_OFFER",categories:["GEAR","ARTIFACT"],tier:1}]},
    {id:"nothing",actions:[]},
  ],
};

export const floor1Events=[unnumberedDoor,talkingBoard1891,lostPropertyOffice] as const;
export const floor1EventRegistry:Readonly<Record<string,EventDefinition>>=Object.fromEntries(floor1Events.map((event)=>[event.id,event]));
