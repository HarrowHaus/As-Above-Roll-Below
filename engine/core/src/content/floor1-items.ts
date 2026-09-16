import type { ItemDefinition, ItemRegistry } from "../items/items.js";

const items: ItemDefinition[] = [
  {id:"bent-knife",displayName:"Bent Knife",category:"GEAR",gearSlot:"WEAPON",tier:1,basePrice:5,unique:true,effectSourceIds:["gear:bent-knife"]},
  {id:"twin-nails",displayName:"Twin Nails",category:"GEAR",gearSlot:"WEAPON",tier:1,basePrice:6,unique:true,effectSourceIds:["gear:twin-nails"]},
  {id:"breaching-bar",displayName:"Breaching Bar",category:"GEAR",gearSlot:"WEAPON",tier:2,basePrice:9,unique:true,effectSourceIds:["gear:breaching-bar"]},
  {id:"work-apron",displayName:"Work Apron",category:"GEAR",gearSlot:"ARMOR",tier:1,basePrice:5,unique:true},
  {id:"proof-vest",displayName:"Proof Vest",category:"GEAR",gearSlot:"ARMOR",tier:2,basePrice:9,unique:true,effectSourceIds:["gear:proof-vest"]},
  {id:"inside-out-lining",displayName:"Inside-Out Lining",category:"GEAR",gearSlot:"ARMOR",tier:2,basePrice:8,unique:true},
  {id:"brass-buckle",displayName:"Brass Buckle",category:"GEAR",gearSlot:"UTILITY",tier:1,basePrice:5,unique:true},
  {id:"small-change-purse",displayName:"Small Change Purse",category:"GEAR",gearSlot:"UTILITY",tier:1,basePrice:5,unique:true},

  {id:"mirror-shard",displayName:"Mirror Shard",category:"ARTIFACT",tier:1,basePrice:6,unique:true},
  {id:"loaded-question",displayName:"Loaded Question",category:"ARTIFACT",tier:1,basePrice:6,unique:true,effectSourceIds:["artifact:loaded-question"]},
  {id:"false-bottom",displayName:"False Bottom",category:"ARTIFACT",tier:2,basePrice:9,unique:true,effectSourceIds:["artifact:false-bottom"]},
  {id:"hidden-hand",displayName:"The Hidden Hand",category:"ARTIFACT",tier:2,basePrice:10,unique:true},
  {id:"ash-ledger",displayName:"Ash Ledger",category:"ARTIFACT",tier:1,basePrice:6,unique:true},
  {id:"opposite-number",displayName:"Opposite Number",category:"ARTIFACT",tier:2,basePrice:8,unique:true,effectSourceIds:["artifact:opposite-number"]},
  {id:"brass-caliper",displayName:"Brass Caliper",category:"ARTIFACT",tier:1,basePrice:7,unique:true},
  {id:"red-thread",displayName:"Red Thread",category:"ARTIFACT",tier:1,basePrice:6,unique:true},
  {id:"carbon-paper",displayName:"Carbon Paper",category:"ARTIFACT",tier:2,basePrice:9,unique:true},
  {id:"stuck-key",displayName:"Stuck Key",category:"ARTIFACT",tier:2,basePrice:9,unique:true},
  {id:"receipt-from-nowhere",displayName:"Receipt From Nowhere",category:"ARTIFACT",tier:1,basePrice:6,unique:true},
  {id:"blank-face",displayName:"Blank Face",category:"ARTIFACT",tier:3,basePrice:13,unique:true},

  {id:"redacted-slip",displayName:"Redacted Slip",category:"CONTRABAND",tier:1,basePrice:3,maxCopiesInInventory:2},
  {id:"counterfeit-seal",displayName:"Counterfeit Seal",category:"CONTRABAND",tier:1,basePrice:3,maxCopiesInInventory:2},
  {id:"wire-cutter",displayName:"Wire Cutter",category:"CONTRABAND",tier:1,basePrice:4,maxCopiesInInventory:2},
  {id:"carbon-copy",displayName:"Carbon Copy",category:"CONTRABAND",tier:1,basePrice:4,maxCopiesInInventory:2},
  {id:"emergency-key",displayName:"Emergency Key",category:"CONTRABAND",tier:2,basePrice:5,maxCopiesInInventory:2},
  {id:"temporary-injunction",displayName:"Temporary Injunction",category:"CONTRABAND",tier:2,basePrice:5,maxCopiesInInventory:2},
];

export const floor1ItemRegistry: ItemRegistry = Object.fromEntries(items.map((item)=>[item.id,item]));
export const floor1Items = items as readonly ItemDefinition[];
