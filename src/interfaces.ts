interface ContentItem {
    insert: string | { image: string }; 
}

interface Note {
    id?: number;
    title?: string;
    content?: ContentItem[]; 
    is_pinned?:Boolean
}