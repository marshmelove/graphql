// Check if the user is logged in (you can use more secure methods for this in a real application)
var isLoggedIn = false;
const ns = "http://www.w3.org/2000/svg"

function checkLogin() {
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    if (email.value === '' || password.value === '') {
        return false
    }
    else {
        return true
    }

}

function login() {
    // Perform login logic (you can add your authentication logic here)

    // For demonstration purposes, set isLoggedIn to true
    isLoggedIn = true;

    //since login elements are hidden we need to clear them
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    email.value = '';
    password.value = '';
    // Update the UI based on the login status
    updateUI();

}

function logout() {
    // Perform logout logic

    // For demonstration purposes, set isLoggedIn to false
    isLoggedIn = false;

    // Update the UI based on the login status
    updateUI();
}

function updateUI() {
    var loginContainer = document.getElementById('login-container');

    // Show or hide elements based on the login status
    if (isLoggedIn) {
        loginContainer.style.display = 'none';
    } else {
        loginContainer.style.display = 'flex';
        // Clear content when logging out
        const body = document.querySelector('body');
        const main = document.querySelector('main');
        body.removeChild(main);
        localStorage.removeItem('jwt_token');
    }
}

function displayProfileInfo(id, username, attributes) {
    const profileInfoContainer = document.createElement('article')

    const infoMsg = document.createElement('h1')
    infoMsg.innerText = "Student's info"
    profileInfoContainer.appendChild(infoMsg)

    const userInfoWrapper = document.createElement('ul')

    const uId = document.createElement('li')
    uId.innerText = `Student id: ${id}`
    userInfoWrapper.appendChild(uId)
    const uName = document.createElement('li')
    uName.innerText = `Username: ${username}`
    userInfoWrapper.appendChild(uName)

    for (const [key, value] of Object.entries(attributes)) {
        switch (key) {
            default:
                continue
                break;
            case 'firstName':
                const firstName = document.createElement('li')
                firstName.innerText = `First name: ${value}`
                userInfoWrapper.appendChild(firstName)
                break;
            case 'lastName':
                const lastName = document.createElement('li')
                lastName.innerText = `Last name: ${value}`
                userInfoWrapper.appendChild(lastName)
                break;
            case 'country':
                const country = document.createElement('li')
                country.innerText = `Country: ${value}`
                userInfoWrapper.appendChild(country)
                break;
            case 'email':
                const email = document.createElement('li')
                email.innerText = `Email: ${value}`
                userInfoWrapper.appendChild(email)
                break;
            case 'nationality':
                const nationality = document.createElement('li')
                nationality.innerText = `Nationality: ${value}`
                userInfoWrapper.appendChild(nationality)
                break;
        }
    }

    profileInfoContainer.appendChild(userInfoWrapper)
    profileInfoContainer.classList.add('userInfo')
    return profileInfoContainer
}

function displayAuditRatio(auditXpDown, auditXpUp) {
    const wrapper = document.createElement('article')
    wrapper.classList.add('auditRatio')
    const ratio = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(auditXpUp / auditXpDown)
    const heading = document.createElement('h1')
    heading.innerText = 'Audits ratio'
    wrapper.appendChild(heading)
    let roundedXpUp
    let roundedXPDown

    //rounding xp into readable format
    if (auditXpUp.toString().length >= 6) {
        roundedXpUp = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 }).format(parseInt(auditXpUp))
    } else {
        roundedXpUp = Intl.NumberFormat("en", { notation: "compact", maximumSignificantDigits: 3 }).format(parseInt(auditXpUp))
    }
    if (auditXpDown.toString().length >= 6) {
        roundedXPDown = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 }).format(parseInt(auditXpDown))
    } else {
        roundedXPDown = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 }).format(parseInt(auditXpDown))
    }

    const doneGraph = document.createElementNS(ns, 'svg')
    const receivedGraph = document.createElementNS(ns, 'svg')
    doneGraph.setAttribute('viewBox', '0 0 100 10')
    receivedGraph.setAttribute('viewBox', '0 0 100 10')
    const doneRect = document.createElementNS(ns, 'rect')
    const recievedRect = document.createElementNS(ns, 'rect')

    if ((ratio - 1) > 0) {
        doneRect.setAttribute('width', '100')
        less = 100 - 100 * (ratio - 1)
        recievedRect.setAttribute('width', `${less}`)
    } else if ((ratio - 1 < 0)) {
        recievedRect.setAttribute('width', '100')
        less = 100 - 100 * (1 - ratio)
        doneRect.setAttribute('width', `${less}`)
    } else {
        doneRect.setAttribute('width', '100')
        recievedRect.setAttribute('width', '100')
    }
    doneRect.setAttribute('height', '5')
    recievedRect.setAttribute('height', '5')
    doneRect.setAttribute('fill', '#c5dbc4')
    recievedRect.setAttribute('fill', 'rgb(207, 139, 163)')
    doneGraph.appendChild(doneRect)
    receivedGraph.appendChild(recievedRect)

    const done = document.createElement('p')
    done.innerText = `Done ${roundedXpUp}`
    wrapper.appendChild(done)
    wrapper.appendChild(doneGraph)
    const recieved = document.createElement('p')
    recieved.innerText = `Received ${roundedXPDown}`
    wrapper.appendChild(recieved)
    wrapper.appendChild(receivedGraph)
    const displayRatio = document.createElement('p')
    displayRatio.innerText = `Your audit ratio: ${ratio}`
    wrapper.appendChild(displayRatio)

    return wrapper
}

//creates skills element
function displayStudentSkills(data) {
    const wrapper = document.createElement('article')
    const heading = document.createElement('h1')
    heading.innerText = 'Your skills'
    wrapper.appendChild(heading)
    let skills = []
    let skillNames = new Set()
    let skillProgress = new Map
    //store transactions related to skills and names of skills
    for (const [key, value] of Object.entries(data.transactions)) {
        if (value.type.includes('skill')) {
            skills.push(value)
            skillNames.add(value.type.split('skill_')[1])
        }
    }

    //save only highest values in respective skills
    for (const [key, value] of Object.entries(skills)) {
        const skillName = value.type.split('skill_')[1]
        const skillProgression = value.amount
        if (skillNames.has(skillName)) {
            if (skillProgress.has(skillName) && skillProgress.get(skillName) < skillProgression) {
                skillProgress.set(skillName, skillProgression)
            } else if (!skillProgress.has(skillName)) {
                skillProgress.set(skillName, skillProgression)
            }
        }
    }

    //Started working on a circle with lines for 12 different skills
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 120 120')
    svg.setAttribute('style', 'overflow: visible')
    // svg.classList.add("skills")
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('fill', 'none')
    circle.setAttribute('stroke', 'rgb(0, 0, 0)')
    circle.setAttribute('stroke-width', '0.75')
    circle.setAttribute('cx', '60')
    circle.setAttribute('cy', '60')
    circle.setAttribute('r', '30')
    console.log(skillProgress)
    svg.appendChild(circle)

    //convert set of skillnames into array to iterate over it for clock hand names
    skillNames = Array.from(skillNames)
    //create a path to be drawn over skill clock
    const path = document.createElementNS(ns, 'path')
    path.setAttribute('fill', 'rgba(207, 139, 163, 0.9)')
    let constructedPath = ''
    //draws circle, clock lines and skill names
    for (let i = 0; i < 12; i++) {
        //draws a circle and a line
        let group = document.createElementNS(ns, 'g')
        group.classList.add('sector')
        let line = document.createElementNS(ns, 'line')
        let angle = (Math.PI / 6) * i
        let x = 60 + 30 * Math.cos(angle)
        let y = 60 + 30 * Math.sin(angle)
        line.setAttribute("x1", x.toString())
        line.setAttribute("y1", y.toString())
        line.setAttribute("x2", "60")
        line.setAttribute("y2", "60")
        line.setAttribute('stroke', 'rgb(0, 0, 0)')
        line.setAttribute('stroke-width', '0.75')
        group.appendChild(line)

        //draws text near lines
        let text = document.createElementNS(ns, 'text')
        text.setAttribute('x', (60 + 47 * Math.cos(angle)).toString())
        text.setAttribute('y', (60 + 47 * Math.sin(angle)).toString())
        text.setAttribute('text-anchor', 'middle')
        text.setAttribute('dominant-baseline', 'middle')
        text.innerHTML = `${skillNames[i]}`

        //generate tooltip to display skill progress with text on hover
        const tooltip = document.createElementNS(ns, 'title')
        tooltip.textContent = `Progress: ${skillProgress.get(skillNames[i])}`
        text.appendChild(tooltip)
        group.appendChild(text)

        //define a path for the current skill to draw path element
        if (i === 0) {
            constructedPath += `M ${60 + 30 * Math.cos(angle) * (skillProgress.get(skillNames[i]) / 100)} ${60 + 30 * Math.sin(angle) * (skillProgress.get(skillNames[i]) / 100)}`
        } else {
            constructedPath += ` L ${60 + 30 * Math.cos(angle) * (skillProgress.get(skillNames[i]) / 100)} ${60 + 30 * Math.sin(angle) * (skillProgress.get(skillNames[i]) / 100)}`
        }

        svg.appendChild(group)
    }
    //append constructed path to the path to be drawn
    path.setAttribute('d', constructedPath)
    svg.appendChild(path)

    wrapper.appendChild(svg)
    wrapper.classList.add('skills')
    return wrapper
}

function displayXpByProject(transactions) {
    const wrapper = document.createElement('article')

    const title = document.createElement('h1')
    title.textContent = 'XP by project'
    wrapper.appendChild(title)

    let projectTransactions = []
    let userXp = 0

    for (const value of Object.values(transactions)) {
        if (value.type === 'xp' && !value.path.includes('piscine')) {
            projectTransactions.push(value)
            userXp += value.amount
        }
    }
    console.log(`project count: ${projectTransactions.length}`)
    console.log(userXp)
    //additional wrapper for svg for overflow
    const svg = document.createElementNS(ns, 'svg')
    svg.setAttribute('viewBox', '0 0 200 260')

    //y is used to position rectangles on top of each other
    //heigth of each rectangle is subtracted form total heigth of svg viewbox
    //so rectangles can stack on top of each other
    //dimensions of inner squares
    // Calculate the number of rows and columns in the grid
    var gridRows = Math.ceil(Math.sqrt(projectTransactions.length));
    var gridCols = Math.ceil(projectTransactions.length / gridRows);

    // Calculate the side length of each smaller square
    var s = 200 / Math.max(gridRows, gridCols);

    let y = 0
    let height = s
    let x = 0
    let width = s
    let rectsInRow = Math.floor(200 / width)
    let rects = 0
    let rows = 0
    //generates random colours to colour rectangels
    const randomColour = () => { return `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})` }
    //used to iterate over colours
    for (const value of Object.values(projectTransactions)) {
        const group = document.createElementNS(ns, 'g')

        if (rects === rectsInRow) {
            rects = 0
            rows++
        }
        const rect = document.createElementNS(ns, 'rect')
        rect.setAttribute('width', `${width - 10}`)
        rect.setAttribute('x', `${x + (width * rects)}`)
        rect.setAttribute('height', `${height - 10}`)
        rect.setAttribute('y', `${y + (height * rows)}`)
        rect.setAttribute('fill', `${randomColour()}`)
        rect.addEventListener('mouseover', () => {
            const text = document.createElementNS(ns, 'text')
            text.setAttribute('x', '0')
            text.setAttribute('y', `245`)
            text.textContent = ` - ${value.path.split('/')[3]}: ${value.amount}`
            rect.parentElement.appendChild(text)
        })
        rect.addEventListener('mouseleave', () => {
            const text = Array.from(rect.parentElement.children)
            rect.parentElement.removeChild(text[1])
        })

        rects++
        group.appendChild(rect)
        svg.appendChild(group)
    }

    wrapper.appendChild(svg)
    wrapper.classList.add('xp')

    const changeColours = document.createElement('button')
    changeColours.innerText = 'Change colours'
    changeColours.addEventListener('click', () => {
        const container = document.querySelector('.xp')
        const rectangles = Array.from(container.querySelectorAll('rect'))
        for (const value of Object.values(rectangles)) {
            value.setAttribute('fill', `${randomColour()}`)
        }
    })
    wrapper.appendChild(changeColours)

    const info = document.createElement('p')
    info.textContent = `Total user XP: ${userXp}`
    wrapper.appendChild(info)

    return wrapper
}

function displayWelcomeMsg(username) {
    const wrapper = document.createElement('article')
    wrapper.classList.add('welcome')

    const welcomeMsg = document.createElement('h1')
    welcomeMsg.innerText = `Hello, ${username}!`
    wrapper.appendChild(welcomeMsg)

    const logoutBtn = document.createElement('button')
    logoutBtn.innerText = 'LOGOUT'
    logoutBtn.addEventListener('click', logout)
    wrapper.appendChild(logoutBtn)

    return wrapper
}

function displayUserData(data) {
    //entire page
    const page = document.querySelector('body')
    //container containing all info which is divided in 3 parts


    const studentInfo = document.createElement('main')
    studentInfo.classList.add('parent')
    page.appendChild(studentInfo)

    const welcomeBanner = displayWelcomeMsg(data.login)
    studentInfo.appendChild(welcomeBanner)

    //contains student profile info
    const profile = displayProfileInfo(data.id, data.login, data.attrs)
    studentInfo.appendChild(profile)

    const audit = displayAuditRatio(data.totalDown, data.totalUp)
    studentInfo.appendChild(audit)
    //contains sutdent skills
    const skills = displayStudentSkills(data)
    studentInfo.appendChild(skills)

    const projectXp = displayXpByProject(data.transactions)
    studentInfo.appendChild(projectXp)
}

async function fetchServerData() {
    const query = `
                    query {
                        user {
                            id
                            login
                            attrs
                            totalUp
                            totalDown
                            createdAt
                            updatedAt
                            transactions(order_by: { createdAt: asc }) {
                                id
                                userId
                                type
                                amount
                                createdAt
                                path
                            }
                        }
                    }`;

    await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({ query })
    }).then(response => {
        if (!response.ok) {
            console.log('query problem', response)
        } else {
            return response.json()
        }
    }).then(data => {
        console.log(data)
        console.log(data.data.user)
        displayUserData(data.data.user[0])
    }).catch(error => {
        console.log(error)
    })
};

document.getElementById('login-submit').addEventListener('click', async (e) => {
    e.preventDefault()

    if (checkLogin()) {
        await fetch('https://01.kood.tech/api/auth/signin', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${btoa(`${document.getElementById('login-email').value}:${document.getElementById('login-password').value}`)}`
            }
        }).then(response => {
            if (response.status != 200) {
                console.log(response)
                throw new Error('Trouble logging in. Please try again.')
            } else {
                return response.json()
            }
        }).then(token => {
            //update login form UI after successful fetch
            login()
            localStorage.setItem('jwt_token', token)
            fetchServerData()
        }).catch(error => {
            alert(error.message)
        })
    } else {
        alert('Invalid login credentials. Please try logging again.')
    }
});