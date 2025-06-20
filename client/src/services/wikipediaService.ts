export class WikipediaService {
    private static readonly BASE_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
    private static readonly CONTENT_URL = 'https://en.wikipedia.org/w/api.php';

    // Check if a title should redirect to Wikipedia instead of being displayed
    private static shouldRedirectToWikipedia(title: string): boolean {
        const nonArticleNamespaces = [
            'File:', 'Image:', 'Media:', 'Category:', 'Template:', 'Help:', 
            'Portal:', 'User:', 'Wikipedia:', 'Special:', 'Talk:', 'User_talk:', 
            'Wikipedia_talk:', 'File_talk:', 'MediaWiki:', 'MediaWiki_talk:',
            'Template_talk:', 'Help_talk:', 'Category_talk:', 'Portal_talk:',
            'Module:', 'Module_talk:', 'TimedText:', 'TimedText_talk:'
        ];
        
        return nonArticleNamespaces.some(namespace => 
            title.startsWith(namespace) || title.includes(':' + namespace.replace(':', ''))
        );
    }

    static async fetchArticle(title: string) {
        try {
            // Check if this should redirect to Wikipedia
            if (this.shouldRedirectToWikipedia(title)) {
                // Redirect to Wikipedia for non-article content
                const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
                window.location.href = wikipediaUrl;
                return null; // This won't be reached due to redirect
            }

            // First, get the summary
            const summaryResponse = await fetch(`${this.BASE_URL}${encodeURIComponent(title)}`);
            
            if (!summaryResponse.ok) {
                // If article not found, redirect to Wikipedia search
                if (summaryResponse.status === 404) {
                    const wikipediaUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(title)}`;
                    window.location.href = wikipediaUrl;
                    return null;
                }
                throw new Error('Article not found');
            }
            
            const summary = await summaryResponse.json();
            
            // Check if the returned content indicates it's a disambiguation or redirect page
            if (summary.type === 'disambiguation' || summary.type === 'no-extract') {
                const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
                window.location.href = wikipediaUrl;
                return null;
            }
            
            // Get the full HTML content with images and tables
            const contentResponse = await fetch(
                `${this.CONTENT_URL}?action=parse&format=json&page=${encodeURIComponent(title)}&prop=text|images|sections&disableeditsection=1&origin=*`
            );
            
            const contentData = await contentResponse.json();
            let fullHtmlContent = '';
            
            if (contentData.parse && contentData.parse.text) {
                fullHtmlContent = contentData.parse.text['*'];
                
                // Fix relative URLs to absolute URLs
                fullHtmlContent = fullHtmlContent.replace(
                /href="\/wiki\//g, 
                'href="https://en.wikipedia.org/wiki/'
                );
                fullHtmlContent = fullHtmlContent.replace(
                /src="\/\/upload\.wikimedia\.org/g,
                'src="https://upload.wikimedia.org'
                );
                fullHtmlContent = fullHtmlContent.replace(
                /srcset="\/\/upload\.wikimedia\.org/g,
                'srcset="https://upload.wikimedia.org'
                );
            }
            
            return {
                title: summary.title,
                description: summary.description,
                extract: summary.extract,
                fullHtmlContent: fullHtmlContent,
                thumbnail: summary.thumbnail,
                url: summary.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
                lastModified: new Date().toLocaleDateString()
            };
        } 
        catch (error) {
            console.error('Error fetching Wikipedia article:', error);
            throw error;
        }
    }

    static async searchArticles(query: string, limit: number = 10) {
        try {
        const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=${limit}&namespace=0&format=json&origin=*`
        );
        
        const data = await response.json();
        const [, titles, descriptions, urls] = data;
        
        return titles.map((title: string, index: number) => ({
            title,
            description: descriptions[index],
            url: urls[index]
        }));
        } catch (error) {
        console.error('Error searching Wikipedia:', error);
        return [];
        }
    }
}
