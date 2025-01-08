const register_user = () => {

    let base_url = BaseUrl() + `${end_point}`

    $.ajax({
        type: "POST",
        url: `${base_url}`,
        contentType: 'application/json',
        processData: true,
        data: JSON.stringify(body),
        success: function (result) {
            // console.log(result, "result")
            if (result.status) {
                switch (process) {
                    case 2:
                        // console.log(result.data.type)
                        if (result.data.type == 'success') {
                            window.location = BaseUrl() + `email_actions/${result.token}`
                        }
                        else {
                            $("#invalid_otp").removeClass("d-none")
                        }
                        break;
                    case 3:
                        $("#invalid_otp").addClass('d-none')
                        $('#otp1').val('');
                        $('#otp2').val('');
                        $('#otp3').val('');
                        $('#otp4').val('');
                        $('#verifyOtpButton').prop('disabled', true);
                        break
                    default:
                        break
                }

            }
        },
        error: error => {
            alert(error.responseJSON.message)
        }
    });

    // // Handle registration process form submit
    // document.getElementById('register-form').addEventListener('submit', async function (e) {
    //     e.preventDefault();
    //     console.log("trigerred")
    //     const input_obj = {}
    //     input_obj['name'] = document.getElementById('name').value;
    //     input_obj['email'] = document.getElementById('email').value;
    //     input_obj['password'] = document.getElementById('password').value;
    //     const parent_id = document.getElementById('referral').value;
    //     if (parent_id) {
    //         input_obj['parent_id']
    //     }

    //     fetch('/create_user', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(input_obj)
    //     }).then(response => {
    //         if (!response.ok) {
    //             return response.json().then(errData => {
    //                 throw errData.errors;
    //             });
    //         }
    //         return response.json(); // Success
    //     })
    //     .then(data => {
    //             console.log('Success:', data);
    //         })
    //     .catch(errors => {
    //             console.log(errors)
    //         });
    // })
}