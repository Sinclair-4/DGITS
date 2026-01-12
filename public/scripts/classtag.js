const rooms = document.querySelectorAll(".room");

rooms.forEach(room => {
    const roomActive = room.querySelector('.room-active');
    const roomHeader = room.querySelector('.room-header'); 
    const roomContent = room.querySelector('.room-content');
    const roomDetailsWrapper = room.querySelector('.room-details-wrapper');
    const teacherDetailsContainer = room.querySelector('.teacher-details-container');

    room.addEventListener('click', () => {
        if (roomActive.style.width === "100%") {
            roomActive.style.width = "0%";
            room.style.height = "75px";
            // room.style.height = window.innerWidth < 600 ? "75px" : "100px";
            roomContent.style.animation = "fade-down .5s ease-in-out";
            roomHeader.style.borderTop = "none";
        } else {
            const overAllHeight = roomHeader.offsetHeight + roomContent.offsetHeight;
            roomActive.style.width = "100%";
            room.style.height = "600px";
            room.style.height = "auto";
            room.style.height = `${overAllHeight}px`;
            roomContent.style.animation = "fade-up .5s ease-in-out";
            // roomHeader.style.borderTop = "1px solid rgba(255, 255, 255, .1)";
        }
    });
});