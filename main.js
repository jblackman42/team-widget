
class TeamWidget extends HTMLElement {
    constructor() {
        super();
        this.update();
    }
    update = async () => {
        const contact_ids = JSON.parse(this.getAttribute('contacts'))
        this.staff = await this.getStaff(contact_ids);

        
        const loadingDOM = document.createElement('div')
            loadingDOM.id = 'loadingScreen';
        const loaderDOM = document.createElement('div');
            loaderDOM.id = 'loader';
            loadingDOM.appendChild(loaderDOM)
        
        for (let i = 0; i < this.staff.length; i ++) {
            const {Display_Name, Last_Name, Nickname, Job_Title, Image_URL, Contact_ID} = this.staff[i];

            const staffMemberDOM = document.createElement('div');
                staffMemberDOM.classList.add('staff-member');


            this.appendChild(loadingDOM)

            staffMemberDOM.innerHTML = `
                <div class="staff-member">
                    <div class="image-container">
                        <img src="${Image_URL}" alt="${Display_Name}">
                    </div>
                    <div class="staff-content">
                        <h1>${Nickname} ${Last_Name}</h1>
                        <p>${Job_Title}</p>
                        <button id="btn-${Contact_ID}">Email ${Nickname}</button>
                    </div>
                </div>
                <div class="email-form-container" id="form-${Contact_ID}">
                    <div class="form-header"><button id="close-${Contact_ID}"><i class="material-icons">close</i></button></div>
                    <form id="${Contact_ID}">
                        <h1>Email ${Nickname}</h1>
                        <div class="form-input">
                            <label for="Name">Name:</label>
                            <input type="text" name="Name" id="Name-${Contact_ID}">
                        </div>
                        <div class="form-input">
                            <label for="Email">Email:</label>
                            <input type="email" name="Email" id="Email-${Contact_ID}">
                        </div>
                        <div class="form-input">
                            <label for="Message">Message:</label>
                            <textarea name="Message" id="Message-${Contact_ID}"></textarea>
                        </div>
                        <p class="error-msg" id="error-${Contact_ID}"></p>
                        <button type="submit" id="send-${Contact_ID}">Send Email</button>
                    </form>
                </div>
            `

            this.appendChild(staffMemberDOM)

            const emailBtn = document.getElementById(`btn-${Contact_ID}`);
                emailBtn.onclick = () => this.openEmailForm(Contact_ID);

            const closeBtn = document.getElementById(`close-${Contact_ID}`);
            closeBtn.onclick = () => this.closeEmailForm(Contact_ID);

            const formDOM = document.getElementById(`form-${Contact_ID}`);
                formDOM.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const nameValue = document.getElementById(`Name-${Contact_ID}`).value;
                    const emailValue = document.getElementById(`Email-${Contact_ID}`).value;
                    const messageValue = document.getElementById(`Message-${Contact_ID}`).value;
                    this.sendEmail(Contact_ID, nameValue, emailValue, messageValue);
                })
        }
    }

    getStaff = async (ids) => {
        return await axios({
            method: 'post',
            url: 'http://localhost:3000/api/widgets/staff',
            data: {
                ids: ids
            }
        })
            .then(response => response.data.staff);
    }
    
    openEmailForm = (id) => {
        this.closeAllForms();
        const formDOM = document.getElementById(`form-${id}`);
            formDOM.style.display = 'flex';
            formDOM.style.visibility = 'visible';
    }
        
    closeEmailForm = (id) => {
        const formDOM = document.getElementById(`form-${id}`);
            formDOM.style.display = 'none';
            formDOM.style.visibility = 'hidden';
    }

    closeAllForms = () => {
        const forms = document.querySelectorAll('.email-form-container');
        forms.forEach(form => {
            form.style.display = 'none';
            form.style.visibility = 'hidden';
        })
    }

    sendEmail = async (id, name, email, message) => {
        this.startLoading();
        await axios({
            method: 'post',
            url: 'https://phc.events/api/widgets/email',
            headers: {
                "Content-Type": "application/json",
                "Auth-Key": "bowling-pins-are-cool"
            },
            data: {
                "Name": name,
                "Email": email,
                "Subject": `${name} Sent You a Message!`,
                "Message": 
                    `<body style="background: #f6f6f6; margin: 2rem; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                        <div style="background-color: white; max-width: 580px; padding: 10px; margin: 0 auto;">
                            <h2 style="text-align: center; margin: 0;">New Message From: ${name}</h2>
                            <p>You have a new message from the online contact form! To reply to this message, please reach out to ${name} at <a style="font-weight: bold;" href="mailto:${email}">${email}</a></p>
                            <p style="margin: .5rem 0; font-weight: bold;">Message:</p>
                            <div style="background-color: #f6f6f6; padding: 10px;">
                                <p style="margin: 0;">${message}</p>
                            </div>
                            <p style="text-align: center"><strong>PLEASE DO NOT REPLY TO THIS EMAIL</strong></p>
                            <p style="text-align: center"><strong>REPLY TO: <a href="mailto:${email}">${email}</a></strong></p>
                        </div>
                        <div style="margin: 1rem auto; max-width: 350px;">
                            <img style="width: 100%;" src="https://www.pureheart.org/wp-content/uploads/2022/12/PH_Logo_BLACK-1.png" alt="Pure Heart Church Logo">
                            <p style="display: flex; gap: .5rem; justify-content: center; margin: 0;">Got Questions? <a style="display: block;" href="mailto:helpdesk@pureheart.org">helpdesk@pureheart.org</a></p>
                        </div>
                    </body>`,
                "RecipientContactID": id
            }
        })
            .then(() => {
                const formDOM = document.getElementById(id);
                formDOM.innerHTML = '<h3>Your Email Has Been Sent</h3><p>Thank you for your correspondence!</p>'
                this.stopLoading();
            })
            .catch(err => {
                const errorMsgDOM = document.getElementById(`error-${id}`);
                    errorMsgDOM.innerText = 'Email Failed. Please Try Again Later';
                this.stopLoading();
            })
    }

    startLoading = () => {
        const loadingDOM = document.getElementById('loadingScreen');
            loadingDOM.style.display = 'grid';
            loadingDOM.style.visibility = 'visible';
    }
    stopLoading = () => {
        const loadingDOM = document.getElementById('loadingScreen');
            loadingDOM.style.display = 'none';
            loadingDOM.style.visibility = 'hidden';
    }
}

customElements.define('team-widget', TeamWidget)