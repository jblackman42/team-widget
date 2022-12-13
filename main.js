const access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImRNTFVxVDJ3S0U4NnpoWE1NWkowbmZwVzItZyIsImtpZCI6ImRNTFVxVDJ3S0U4NnpoWE1NWkowbmZwVzItZyJ9.eyJpc3MiOiJodHRwczovL215LnB1cmVoZWFydC5vcmcvbWluaXN0cnlwbGF0Zm9ybWFwaS9vYXV0aCIsImF1ZCI6Imh0dHBzOi8vbXkucHVyZWhlYXJ0Lm9yZy9taW5pc3RyeXBsYXRmb3JtYXBpL29hdXRoL3Jlc291cmNlcyIsImV4cCI6MTY3MDk3Mjk3NSwibmJmIjoxNjcwOTY5Mzc1LCJjbGllbnRfaWQiOiJQbGF0Zm9ybS5XZWIuU2VydmljZXMiLCJzY29wZSI6Imh0dHA6Ly93d3cudGhpbmttaW5pc3RyeS5jb20vZGF0YXBsYXRmb3JtL3Njb3Blcy9hbGwiLCJzdWIiOiIzMjVlYjkzZS0wMWUyLTRjNDItYjk0YS1mYmU3ZGI4MjAzNWEiLCJhdXRoX3RpbWUiOjE2NzA5NTEwNzUsImlkcCI6Imlkc3J2IiwiYXV0aF9oYXNoIjoiU3VmSjhMY3RNR1ZKb3U0U0QzK01Hdz09IiwibmFtZSI6ImpibGFja21hbiIsImFtciI6WyJwYXNzd29yZCJdfQ.XserO4er3PAQlG7XG005clKnExTVzFmYorFI96c8yPy2rdkYxLjWD2X6wvnDPsVyZSezO_6cZHwtBAUF_nmQ7Q33iXetUWIqEqggfg9kB2isddtKpZDAeF3G3Nm9IrHlzqf1UovtMVrCXi68pmfVO9n8cP7qr5i0vOLTFEH0tuVCvIMdYTz5TM1hV1TFN_0VW_PqLWilz5ZhE5Osxs87PANEr-EyBxnqs2zYJcykKPwgLWJawaAfN78yZJHyuYo8BacTbz9cUG0_w_Gxc5UxiSl2-x0C3wW7Z5bkCyMufeSIq0DD8UVUzhb6RUlJlkBSOFfJxzrGCdf_Z4gMyJH2Xg';



class TeamWidget extends HTMLElement {
    constructor() {
        super();

        this.contacts = [94810, 91874, 44832, 942, 62225];
        this.update();
    }
    update = async () => {
        for (let i = 0; i < this.contacts.length; i ++) {
            const contact = await this.getContact(this.contacts[i])
            const file = await this.getFileID(this.contacts[i])
            const imageURL = `https://my.pureheart.org/ministryplatformapi/files/${file.UniqueFileId}`;
            const staffRecord = await this.getStaffRecord(this.contacts[i])
            const {Display_Name, First_Name, Last_Name, Nickname} = contact;
            const {Job_Title} = staffRecord;

            const staffMemberDOM = document.createElement('div');
                staffMemberDOM.classList.add('staff-member');

            staffMemberDOM.innerHTML = `
                <div class="staff-member">
                    <div class="image-container">
                        <img src="${imageURL}" alt="${Display_Name}">
                    </div>
                    <div class="staff-content">
                        <h1>${Nickname} ${Last_Name}</h1>
                        <p>${Job_Title}</p>
                        <button>Email ${Nickname}</button>
                    </div>
                </div>
            `

            this.appendChild(staffMemberDOM)
        }
    }

    getContact = async (Contact_ID) => {
        return await axios({
            method: 'get',
            url: `https://my.pureheart.org/ministryplatformapi/tables/Contacts/${Contact_ID}`,
            headers: {
                'Accept': 'application-json',
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(response => response.data[0])
    }

    getFileID = async (Contact_ID) => {
        return await axios({
            method: 'get',
            url: `https://my.pureheart.org/ministryplatformapi/files/Contacts/${Contact_ID}`,
            headers: {
                'Accept': 'application-json',
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(response => response.data.filter(file => file.IsDefaultImage == true)[0])
    }
    
    getStaffRecord = async (Contact_ID) => {
        return await axios({
            method: 'get',
            url: `https://my.pureheart.org/ministryplatformapi/tables/Staff?$filter=Contact_ID=${Contact_ID}`,
            headers: {
                'Accept': 'application-json',
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(response => response.data[0])

    }
}

customElements.define('team-widget', TeamWidget)