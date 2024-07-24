document.addEventListener("DOMContentLoaded", async function() {
    async function loadRepos() {
        try {
            const response = await fetch('{{ "/js/repos.json" | relative_url }}');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const repos = await response.json();
            console.log('Loaded repositories:', repos);
            return repos;
        } catch (error) {
            console.error('Failed to load repositories:', error);
        }
    }

    function createIndex(repos, field) {
        return lunr(function () {
            this.field('name');
            this.field(field);
            repos.forEach(repo => {
                this.add({
                    'name': repo.name,
                    [field]: repo[field] ? repo[field].join ? repo[field].join(' ') : repo[field] : '',
                    'id': repo.name
                });
            });
        });
    }

    function populateTopicSelect(repos) {
        const topicSelect = document.getElementById('topic-select');
        const uniqueTopics = new Set();
        repos.forEach(repo => {
            if (Array.isArray(repo.topics)) {
                repo.topics.forEach(topic => uniqueTopics.add(topic));
            }
        });
        const sortedTopics = Array.from(uniqueTopics).sort();
        console.log('Sorted topics:', sortedTopics);
        topicSelect.innerHTML = '<option value="">-- Select a Topic --</option>';
        sortedTopics.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic;
            option.textContent = topic;
            topicSelect.appendChild(option);
        });
    }

    function searchRepos(query, index, repos) {
        const results = index.search(`*${query}*`);
        const repoList = document.getElementById('repo-list');
        repoList.innerHTML = '';
        results.forEach(result => {
            const repo = repos.find(r => r.name === result.ref);
            if (repo) {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${repo.url}">${repo.name}</a>`;
                repoList.appendChild(li);
            }
        });
        if (results.length === 0) {
            repoList.innerHTML = '<li>No results found</li>';
        }
    }

    const repos = await loadRepos();
    if (repos) {
        const topicIndex = createIndex(repos, 'topics');
        const nameIndex = createIndex(repos, 'name');
        populateTopicSelect(repos);
        document.getElementById('search-topic-input').addEventListener('input', function () {
            const query = this.value;
            searchRepos(query, topicIndex, repos);
        });
        document.getElementById('topic-select').addEventListener('change', function () {
            const query = this.value;
            searchRepos(query, topicIndex, repos);
        });
        document.getElementById('search-name-input').addEventListener('input', function () {
            const query = this.value;
            searchRepos(query, nameIndex, repos);
        });
    }
});
