(() => { 
  const tab = document.querySelector(".size-tabs");
  const tabButtons = tab.querySelectorAll('[role="tab"]');
  const tabPanels = Array.from(tab.querySelectorAll('[role="tabpanel"]'));

  const tabClickHandler = (e) => {         
      tabPanels.forEach((panel) => {
          panel.hidden = "true";
      });      
      
      tabButtons.forEach((button) => {
          button.setAttribute("aria-selected", "false");
      });
  
      e.currentTarget.setAttribute("aria-selected", "true");
  
      const { id } = e.currentTarget;
  
      const currentTab = tabPanels.find(
          (panel) => panel.getAttribute("aria-labelledby") === id
      );
  
      currentTab.hidden = false;
  };
  
  tabButtons.forEach((button) => {
      button.addEventListener("click", tabClickHandler);
  });
})();