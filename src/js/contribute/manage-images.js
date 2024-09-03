// https://github.com/SortableJS/Sortable
import Sortable from 'sortablejs';

 const initSortable = () => {
    const el = document.getElementById('simpleList');
    new Sortable(el, {
        swapThreshold: 1,
        animation: 150,
        onMove: function (evt) {
            console.log("moved")
        },
    });
 }


 export { initSortable }