const confirmModalBtnId = "modal-confirm-btn-id"

const deleteModalId = "delete--modal-id"

const popupParent = document.querySelector('.popup')

const popUpBackground = document.querySelector('.popup-background')

const posPagDeleteBtn = document.querySelector("#pos-pag-delete-btn-id")

popUpBackground.addEventListener("click", () => {
   try {
      closeDeleteModal()
   } catch (e) {}
})

function activatePopUp() {
   popupParent.classList.add("active")
   popUpBackground.classList.add("active")
}

function deactivatePopUp() {
   popupParent.classList.remove("active")
   popUpBackground.classList.remove("active")
}

function closeDeleteModal() {
   deactivatePopUp()
   const deleteModal = document.getElementById(deleteModalId)
   popupParent.removeChild(deleteModal)
}

function closeModal() {
   deactivatePopUp()
   const deleteModal = document.getElementById(deleteModalId)
   popupParent.removeChild(deleteModal)
}


function showDeletePositionModal(onConfirm) {
   const deleteModal = document.createElement("div")
   deleteModal.id = deleteModalId
   deleteModal.insertAdjacentHTML(
       "beforeend",
       newDeleteModalHTML(
           "Удаление проекта",
           "Вы уверены, что хотите удалить проект? Это действие нельзя будет отменить, и все данные проекта будут потеряны.",
       ))
   deleteModal.classList.add("pop-delete", "active")
   popupParent.appendChild(deleteModal)
   const deleteBtn = document.getElementById(confirmModalBtnId)
   deleteBtn.addEventListener("click", onConfirm)
   activatePopUp()
}

function newDeleteModalHTML(title, text) {
   return `<div class="pop-delete__exit-button pop-delete__exit active">
   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <mask id="mask0_440_47439" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
       <rect width="24" height="24" fill="white"></rect>
     </mask>
     <g mask="url(#mask0_440_47439)">
       <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="#BBBBBB"></path>
     </g>
   </svg>
 </div>
 <div class="popup-title">${title}</div>
 <div class="pop-delete__text">
   ${text}
 </div>
 <div class="pop-project__buttons">
   <button class="delete-button btn-reset" id="${confirmModalBtnId}">
     <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
       <mask id="mask0_2082_5379" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="25">
         <rect y="0.5" width="24" height="24" fill="#D9D9D9"></rect>
       </mask>
       <g mask="url(#mask0_2082_5379)">
         <path d="M5.975 7.16667V7.06667H5.875H5.1V5.48889H9.375H9.475V5.38889V4.6H14.525V5.38889V5.48889H14.625H18.9V7.06667H18.125H18.025V7.16667V18.7222C18.025 19.1849 17.864 19.5782 17.5397 19.9076C17.2154 20.237 16.829 20.4 16.375 20.4H7.625C7.171 20.4 6.78456 20.237 6.46033 19.9076C6.13605 19.5782 5.975 19.1849 5.975 18.7222V7.16667ZM16.475 7.16667V7.06667H16.375H7.625H7.525V7.16667V18.7222V18.8222H7.625H16.375H16.475V18.7222V7.16667ZM11.025 9.04444V16.8444H9.475V9.04444H11.025ZM14.525 9.04444V16.8444H12.975V9.04444H14.525Z" fill="#E50C00" stroke="#FDF4F4" stroke-width="0.2"></path>
       </g>
     </svg>
     <span>Удалить</span>
   </button>
   <div class="transparent-button pop-delete__exit" onclick="closeModal()">Отменить</div>
</div>`
}
