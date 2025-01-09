const purchase_performed = () => {

    // const socket = io();

    // socket.on('validationError', (errors) => {
    //     const errorList = document.getElementById('errorMessages');
    //     errorList.innerHTML = '';  // Clear previous errors

    //     errors.forEach((error) => {
    //         const li = document.createElement('li');
    //         li.textContent = error;
    //         errorList.appendChild(li);
    //     });
    // });

    // Listen for registration success
    // socket.on('registrationSuccess', (message) => {
    //     alert(message);
    //     // window.location.href = '/login';  // Redirect to login page after successful registration
    // });

    // Listen for registration error
    // socket.on('registrationError', (message) => {
    //     alert(message);
    // });


        let url = BaseUrl() + `create_purchase`

        let input_obj = {}
        input_obj['amount'] = document.getElementById('amount').value;
        input_obj['buyer_id'] = document.getElementById('buyer_id').value;

        if (isNaN(input_obj['amount']) || parseFloat(input_obj['amount']) < 1000) {
            showNotification('Purchase amount should be above 1000 Rs', true);
            return;
          }

        console.log(input_obj, "input")
        $.ajax({
            type: "POST",
            url: `${url}`,
            contentType: 'application/json',
            processData: true,
            data: JSON.stringify(input_obj),
            success: function (result) {
                console.log(result, "result")
                if (result.status==200) {
                    showNotification(result.message)
                    result.data.forEach((val)=>{
                        showNotification(val)
                    })
                }
            },
            error: function (error) {
                console.log(error)
                if (error.responseJSON) {
                    // socket.emit('registrationError', error.responseJSON.errors);
                    showNotification(error.responseJSON.message, true)
                }
            }
        });

}

document.getElementById('purchase-form').addEventListener('submit', (e)=>{
    e.preventDefault()
    purchase_performed()
})


const view_earnings = () => {
    let user_id = document.getElementById('buyer_id').value;
    window.location = BaseUrl() + `earnings?user_id=${user_id}`
}