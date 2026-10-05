import test from 'node:test';
import assert from 'node:assert/strict';
import {sellerInput,matchesFileSignature,SELL_LIMITS} from '../lib/sell-validation.ts';
const valid={brand:'Volvo',model:'C40',registration:'2023-04',km:52000,fuel:'Elektrisch',transmission:'Automaat',body:'SUV',description:'Een zorgvuldig onderhouden wagen.',name:'Test Verkoper',email:'test@example.com',postcode:'9800',language:'nl',consent:true};
test('seller intake requires explicit consent, real email and plausible vehicle data',()=>{
  assert.equal(sellerInput.safeParse(valid).success,true);
  for(const invalid of [{consent:false},{email:'abc'},{km:-1},{registration:'2020-13'},{registration:'2999-01'},{description:''},{website:'bot.example'}])assert.equal(sellerInput.safeParse({...valid,...invalid}).success,false);
});
test('all three interface languages and optional unknown vehicle facts are accepted',()=>{
  for(const language of ['nl','en','fr'])assert.equal(sellerInput.safeParse({...valid,language}).success,true);
  assert.equal(sellerInput.safeParse({...valid,language:'de'}).success,false);
  const result=sellerInput.parse(valid);assert.equal(result.power,undefined);assert.equal(result.co2,undefined);assert.equal(result.serviceHistory,'unknown');
});
test('PII, description and equipment sizes stay bounded',()=>{
  for(const invalid of [{description:'x'.repeat(10001)},{name:'x'.repeat(101)},{equipment:Array(81).fill('Cruise control')},{damage:'x'.repeat(3001)}])assert.equal(sellerInput.safeParse({...valid,...invalid}).success,false);
});
test('rejects HTML/SVG masquerading as allowed image or video',()=>{
  const fake=new TextEncoder().encode('<svg onload="alert(1)"></svg>');
  for(const type of ['image/jpeg','image/png','image/webp','video/mp4','video/webm'])assert.equal(matchesFileSignature(type,fake),false);
  assert.equal(matchesFileSignature('image/svg+xml',fake),false);
  assert.equal(matchesFileSignature('image/jpeg',new Uint8Array([255,216])),false);
});
test('supported file signatures are recognized; HEIC is not silently treated as MP4',()=>{
  const png=new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,13]);assert.equal(matchesFileSignature('image/png',png),true);
  const jpeg=new Uint8Array([255,216,255,224,0,0,0,0,0,0,0,0]);assert.equal(matchesFileSignature('image/jpeg',jpeg),true);
  assert.equal(matchesFileSignature('image/webp',new TextEncoder().encode('RIFF0000WEBPVP8 ')),true);
  assert.equal(matchesFileSignature('video/mp4',new TextEncoder().encode('0000ftypisom0000')),true);
  assert.equal(matchesFileSignature('video/mp4',new TextEncoder().encode('0000ftypheic0000')),false);
  assert.equal(SELL_LIMITS.totalBytes,120*1024*1024);
});
