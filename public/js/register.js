// const socket = io();

const register_user = () => {
    // socket.on('message', (message)=>{
    //     const errorList = document.getElementById('errorMessages');
    //     const li = document.createElement('li');
    //     li.textContent = message;
    //     errorList.appendChild(li);
    // })
    

    // Listen for registration success
    // socket.on('registrationSuccess', (message) => {
    //     alert(message);
        // window.location.href = '/login';  // Redirect to login page after successful registration
    // });

    // Listen for registration error
    // socket.on('registrationError', (message) => {
    //     alert(message);
    // });
    // return
    let referralSelect = document.getElementById('referral').value;

    // console.log(referralSelect, "referralSelect")

        let url = BaseUrl() + `create_user`

        let input_obj = {}
        input_obj['name'] = document.getElementById('name').value;
        input_obj['email'] = document.getElementById('email').value;
        input_obj['password'] = document.getElementById('password').value;
        let parent_id = referralSelect;
        if (parent_id) {
            input_obj['parent_id'] = parent_id
        }

        // console.log(input_obj, "input")
        $.ajax({
            type: "POST",
            url: `${url}`,
            contentType: 'application/json',
            processData: true,
            data: JSON.stringify(input_obj),
            success: function (result) {
                // console.log(result, "result")
                if (result.status==201) {
                    showNotification(result.message)
                    window.location = BaseUrl() + `login`
                }
            },
            error: function (error) {
                console.log(error)
                if (error.responseJSON) {
                    // socket.emit('validationError', error.responseJSON.message);
                    showNotification(error.responseJSON.message, true)
                }
            }
        });

}

document.getElementById('register-form').addEventListener('submit', (e)=>{
    e.preventDefault()
    register_user()
})

// socket.on('validationError', (errors) => {
//     const errorList = document.getElementById('errorMessages');
//     errorList.innerHTML = '';  // Clear previous errors

//     errors.forEach((error) => {
//         const li = document.createElement('li');
//         li.textContent = error;
//         errorList.appendChild(li);
//     });
// });
