document.addEventListener('DOMContentLoaded', () => {
    const projectsData = [
        {
            title: "ZooSeeker Application",
            image: "Images/Zooseeker.png",
            alt: "ZooSeeker App Interface",
            description: "A mobile application that provides optimized routes for zoo visitors, helping them navigate through exhibits efficiently.",
            technologies: "Java,Android,Graph Algorithms",
            link: "https://github.com/CSE-110-Spring-2022/zooseeker-cse-110-team-3"
        },
        {
            title: "Personal Portfolio Website",
            image: "Images/portfolio.png",
            alt: "Portfolio website screenshot",
            description: "A responsive portfolio website built using modern web technologies and best practices for accessibility and performance.",
            technologies: "HTML,CSS,JavaScript",
            link: "#portfolio"
        }
    ];

    localStorage.setItem('projects', JSON.stringify(projectsData));

    const loadLocalBtn = document.getElementById('load-local');
    const loadRemoteBtn = document.getElementById('load-remote');

    if (loadLocalBtn && loadRemoteBtn) {
        const container = document.getElementById('projects-container');
        container.innerHTML = '<p class="placeholder-message">Click "Load Local" or "Load Remote" to view projects</p>';
    } else {
        console.error('Load buttons not found in the DOM');
    }
});

function createProjectCards(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = ''; 
    
    projects.forEach(project => {
        const card = document.createElement('project-card');
        card.setAttribute('title', project.title);
        card.setAttribute('image', project.image);
        card.setAttribute('alt', project.alt);
        card.setAttribute('description', project.description);
        card.setAttribute('technologies', project.technologies);
        card.setAttribute('link', project.link);
        container.appendChild(card);
    });
}

document.getElementById('load-local').addEventListener('click', () => {
    try {
        const localData = JSON.parse(localStorage.getItem('projects'));
        if (localData) {
            createProjectCards(localData);
        } else {
            console.error('No data found in localStorage');
        }
    } catch (error) {
        console.error('Error loading local data:', error);
    }
});

const BIN_ID = '67d751ee8561e97a50ed50e0'; 
const API_KEY = '$2a$10$6LxtRCiiKir5CgUCRrMDw.xIeLHndXcvJvD4tmeeU01HI.398ci1C'; 

function setLoading(isLoading) {
    const localBtn = document.getElementById('load-local');
    const remoteBtn = document.getElementById('load-remote');
    const container = document.getElementById('projects-container');
    
    localBtn.disabled = isLoading;
    remoteBtn.disabled = isLoading;
    
    if (isLoading) {
        container.innerHTML = '<div class="loading">Loading projects...</div>';
    }
}

document.getElementById('load-remote').addEventListener('click', async () => {
    setLoading(true);
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            headers: {
                'X-Master-Key': API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        createProjectCards(data.record.projects);
        
    } catch (error) {
        console.error('Error loading remote data:', error);
        const container = document.getElementById('projects-container');
        container.innerHTML = '<p class="error">Failed to load remote projects</p>';
    } finally {
        setLoading(false);
    }
});