const itemsPageInit = () => {
    favouriteButtonHandeler();
};

const favouriteButtonHandeler = () => {
    const favouriteButton = document.getElementById("favouriteItemButton");
    if(!favouriteButton) return;

    favouriteButton.addEventListener("click", (e) => {
        e.preventDefault();
        // console.log("favourite button clicked");

        const favourteIcon = document.getElementById("favouriteItemIcon");

        // toggle class itemFavourited on the favouriteIcon
        favourteIcon.classList.toggle("itemFavourited");
    });
};

export { itemsPageInit };