
class TeamWidget extends HTMLElement {
    constructor() {
        super();
        this.update();
    }
    update = async () => {
        this.staff = await this.getStaff();
        const allStaff = this.staff.map(group => group.Participants).flat();
        
        const loadingDOM = document.createElement('div')
            loadingDOM.id = 'loadingScreen';
        const loaderDOM = document.createElement('div');
            loaderDOM.id = 'loader';
            loadingDOM.appendChild(loaderDOM)
        for (let i = 0; i < allStaff.length; i ++) {
            const {Display_Name, Last_Name, Nickname, Job_Title, Image_URL, Contact_ID} = allStaff[i];
            const First_Name = Display_Name.split(' ')[0];

            const staffMemberDOM = document.createElement('div');
                staffMemberDOM.classList.add('staff-member');


            this.appendChild(loadingDOM)

            staffMemberDOM.innerHTML = `
                <div class="staff-member">
                    <div class="image-container">
                        <img src="${Image_URL}" alt="${Display_Name}">
                    </div>
                    <div class="staff-content">
                        <h1>${Display_Name}</h1>
                        <p>${Job_Title}</p>
                        <button id="btn-${Contact_ID}">Email ${First_Name}</button>
                    </div>
                </div>
                <div class="email-form-container" id="form-${Contact_ID}">
                    <form id="form-${Contact_ID}">
                        <h1>Email ${First_Name}</h1>
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
                        <button type="submit" id="send-${Contact_ID}">Send Email</button>
                    </form>
                </div>
            `

            this.appendChild(staffMemberDOM)

            const emailBtn = document.getElementById(`btn-${Contact_ID}`);
                emailBtn.onclick = () => this.openEmailForm(Contact_ID);

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

    getStaff = async () => {
        return await axios({
            method: 'get',
            url: 'http://phc.events/api/widgets/staff'
        })
            .then(response => response.data.staff);
    }
    
    openEmailForm = (id) => {
        const formDOM = document.getElementById(`form-${id}`);
            formDOM.style.display = 'grid';
            formDOM.style.visibility = 'visible';
    }
        
    closeEmailForm = (id) => {
        const formDOM = document.getElementById(`form-${id}`);
            formDOM.style.display = 'none';
            formDOM.style.visibility = 'hidden';
    }

    sendEmail = async (id, name, email, message) => {
        try {
            await axios({
                method: 'post',
                url: 'http://localhost:3000/api/widgets/email',
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
            
            this.closeEmailForm(id)
        } catch (err) {
            console.error(err)
        }
    }
}

customElements.define('team-widget', TeamWidget)


const test = () => {
    console.log('hello world')
}