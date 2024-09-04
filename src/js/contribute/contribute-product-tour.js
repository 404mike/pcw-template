// https://driverjs.com/
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const runContributeTour = () => {
    const driverObj = driver({
        showProgress: true,
        steps: [
          { element: '#contributeTitleContainer', popover: { title: 'Title', description: 'Short Title' } },
          { element: '#contributeDescriptionContainer', popover: { title: 'Description', description: 'Write a description!' } },
          { element: '#contributeCreatorContainer', popover: { title: 'Creator', description: 'Creator of the original item, such as the name of photographer, author, artist etc.' } },
          { element: '#contributeFacetContainer', popover: { title: 'Facets', description: 'relevant categories below' } },
          { element: '#contributeMapContainer', popover: { title: 'Map', description: 'Drop a pin' } },
          { element: '#contributeTocContainer', popover: { title: 'Agree to Terms', description: 'Agree to the terms!' } },
          { element: '#conributeSubmitButtonsContainer', popover: { title: 'Save or Publish', description: 'Save your work for later or publish' } }
        ],
        onDestroyed: () => {
            resetAfterTour();
        }
      });
      
      driverObj.drive();
};

const resetAfterTour = () => {
    window.scrollTo(0, 0);
};

export { runContributeTour }