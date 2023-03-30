import { NextPage } from "next";
import { useEffect, useState } from "react";

// クライアントサイドで実行されるCSR

// TSの型宣言 → NexPage型 の、IndexPage関数の宣言
// IndexPageコンポーネント
const IndexPage: NextPage = () => {
    // useStateで、初期値と、初期値を更新する関数を定義できる
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(true);

    // useEffect → どの関数を（第一）、どのタイミングで（第2）
    // 第2 → [] で、コンポーネントがマウントされたタイミングを表す。
    useEffect(() => {
        //fetchImage() の結果を newImage に格納している。
        fetchImage().then((newImage) => {
            // 画像のURLを更新する
            setImageUrl(newImage.url);
            setLoading(false);
        });
    }, []);

    // ボタンをクリックしたときに画像が更新する非同期関数
    const handleClick = async () => {
        setLoading(true);
        const newImage = await fetchImage();
        setImageUrl(newImage.url);
        setLoading(false);
    };

    return (
        <div>
            <button onClick={handleClick}>他の猫も見る</button>
            <div>{loading || <img src={imageUrl} />}</div>
        </div>
    );
    // ローディング中でなければ、画像を表示する
    // JSXの式には、IFなどの文が使えないので、論理演算や三項演算子を使う
    // return <div>{loading || <img src={imageUrl} />}</div>;
    // or  {loading ? "読み込み中" : <img src="..." />} など
};

// IndexPage 関数を、ページコンポーネントとして認識させる
export default IndexPage;

// 画像のJsonデータの取得するプロパティを指定
// 型を宣言することで、コンパイル時にエラーに気がつけるようにする。
type Image = {
    url: string;
};

// 非同期関数
const fetchImage = async (): Promise<Image> => {
    // 関数が実行されてから、フェッチやres などの非同期関数を実行する。
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images = await res.json();
    // ここではJsonの情報が返る。 ImageのURLが中に格納されている。
    console.log(images);
    return images[0];
};
