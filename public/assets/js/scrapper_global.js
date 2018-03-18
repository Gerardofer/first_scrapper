$(document).ready(() => {
    $(".note-save").on('click', () => {
        $('.ui.modal').modal({
            inverted: true
        }).modal('show');
    })
})