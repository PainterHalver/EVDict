export type Word = {
    word: string;
    mean: string;
    av: string;
};

export type IconProps = {
    size?: number | string;
    fill?: string;
    color: string;
};

export type Category = {
    id: number;
    name: string;
    count?: number;
    created_at: string;
};

export type Statistics = {
    categoryCount: number; // số lượng category
    wordSearchedCount: number; // tổng số lượng từ đã từng tra
    savedWordCount: number; // số lượng từ đã lưu
};
