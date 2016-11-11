function help() {
    document.getElementById('button-return').addEventListener('click',
        function (event) {
            window.location.href = 'popup.html'
        });

}

document.addEventListener('DOMContentLoaded', help);

