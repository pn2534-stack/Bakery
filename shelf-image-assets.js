(() => {
  const art={
    'bakery-bread':'assets/keyed-shelf-bakery-bread.png',pantry:'assets/keyed-shelf-pantry-ingredients.png',
    market:'assets/keyed-shelf-market-groceries.png',books:'assets/keyed-shelf-library-books.png',
    pets:'assets/keyed-shelf-pet-supplies.png',boutique:'assets/keyed-shelf-boutique-accessories.png',
    garden:'assets/keyed-shelf-greenhouse-garden.png',gifts:'assets/keyed-shelf-gifts-packages.png'
  };
  const rules=[
    ['bakery-bread',/bread|cookie|pastry|cake display/i],['pantry',/pantry|ingredient|flour|sugar|chocolate|tea|coffee|cabinet/i],
    ['market',/fresh produce|milk and eggs|frozen|bakery supplies|cleaning|decorations/i],['books',/bookshelf|recipe books|magazine/i],
    ['pets',/pet toys|pet food/i],['boutique',/shoes|accessories|hats/i],['garden',/herb shelves|seed cabinet/i],
    ['gifts',/greeting cards|candles|holiday gifts|packages/i]
  ];
  const processed={};
  function removeMagenta(url){
    if(processed[url])return processed[url];
    processed[url]=new Promise(resolve=>{const image=new Image();image.onload=()=>{const canvas=document.createElement('canvas'),context=canvas.getContext('2d',{willReadFrequently:true});canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;context.drawImage(image,0,0);const pixels=context.getImageData(0,0,canvas.width,canvas.height),data=pixels.data;for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2],key=Math.max(0,Math.min(255,(r+b-g*1.15)-150));if(r>145&&b>145&&g<145)data[i+3]=255-key;else if(r>110&&b>110&&r+b>g*2.4)data[i+3]=Math.max(data[i+3],210)}context.putImageData(pixels,0,0);resolve(canvas.toDataURL('image/png'))};image.onerror=()=>resolve(url);image.src=url});return processed[url]
  }
  async function applyShelfImages(){
    const objects=[...document.querySelectorAll('.bedroom-style-room .physical-object')];
    await Promise.all(objects.map(async object=>{
      const name=object.querySelector('.object-name')?.textContent.trim()||'',match=rules.find(([,pattern])=>pattern.test(name));
      if(!match)return;
      const shelfImage=await removeMagenta(art[match[0]]);
      // Illustrated rooms already contain shelves in their background art.
      // Keep the object as an invisible interaction target without drawing a
      // second shelf image over the scene.
      if(object.closest('.scene-integrated-interior,.clean-bakery-gameplay')){
        delete object.dataset.shelfArt;
        object.style.removeProperty('--shelf-image');
        return;
      }
      object.dataset.shelfArt=match[0];
      object.style.setProperty('--shelf-image',`url("${shelfImage}")`);
    }));
  }
  const previous=renderRoom;renderRoom=function(){previous();applyShelfImages()};applyShelfImages();
})();
