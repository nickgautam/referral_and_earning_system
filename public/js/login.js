const login = () => {

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


        let url = BaseUrl() + `user_login`

        let input_obj = {}
        input_obj['email'] = document.getElementById('email').value;
        input_obj['password'] = document.getElementById('password').value;

        // console.log(input_obj, "input")
        $.ajax({
            type: "POST",
            url: `${url}`,
            contentType: 'application/json',
            processData: true,
            data: JSON.stringify(input_obj),
            success: function (result) {
                // console.log(result, "result")
                if (result.status==200) {
                    showNotification(result.message)
                    window.location = BaseUrl() + `purchase/${result.token}`
                }
            },
            error: function (error) {
                // console.log(error)
                if (error.responseJSON) {
                    // socket.emit('registrationError', error.responseJSON.errors);
                    showNotification(error.responseJSON.message, true)
                }
            }
        });

}

document.getElementById('login-form').addEventListener('submit', (e)=>{
    e.preventDefault()
    login()
})
