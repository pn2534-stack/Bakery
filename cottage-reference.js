(()=>{
  physicalRooms['cottage|Exterior'] = [
    ['Front door','door','Enter Home'],
    ['Garden bench','sofa','Sit'],
    ['Mailbox','shelf','Check Mail'],
    ['Flower garden','plant','Tend Flowers']
  ];
  locations.cottage.tabs = ['Exterior','Living room','Kitchen','Bedroom','Bathroom'];
  locations.cottage.rooms.Exterior = [];

  const cottageInteract = interactPhysical;
  interactPhysical = function(el){
    if(el?.dataset.actionName === 'Enter Home'){
      currentTab = 'Living room';
      renderTabs();
      renderRoom();
      return;
    }
    cottageInteract(el);
  };
})();
