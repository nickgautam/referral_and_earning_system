const BaseUrl = () => {
    const domain = window.location.hostname;
    console.log(window.location.hostname)

    if (domain === "localhost") {
        return "http://localhost:3000/";
    }
}


const showNotification = (message, isError = false) => {    
    const notification = document.createElement('div');
    notification.className = 'notification';
    if (isError) {
      notification.classList.add('error');
    }
    notification.innerText = message;
    document.getElementById('notifications').appendChild(notification);

    // Auto-hide the notification after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 10000);
  }