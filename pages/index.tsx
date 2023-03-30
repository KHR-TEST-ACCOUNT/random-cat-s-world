import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
// CSS インポート → CSSモジュールのクラス名を、TSから参照できるようにする
import styles from "./index.module.css";

// サーバーサイドで実行されるSSR → ページの表示と同時に画像が表示される
//    → ページのリダイレクトと同時に、サーバー上でプログラムが動いているから

// getServerSideProps から渡される、porps型 を定義
type Props = {
    initialImageUrl: string;
};

// TSの型宣言 → NexPage型 の、IndexPage関数の宣言
// Props型になるので、そのプロパティ initialImageUrl を引数で渡す。
const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
    // useStateで、初期値と、初期値を更新する関数を定義できる
    // initialImageUrl の初期値を設定
    //  → 後で、getServerSideProps によって 初期画像が格納される。
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const [loading, setLoading] = useState(false);

    // ボタンをクリックしたときに画像が更新する非同期関数
    const handleClick = async () => {
        setLoading(true);
        const newImage = await fetchImage();
        setImageUrl(newImage.url);
        setLoading(false);
    };
    // クリック時の処理
    return (
        <div className={styles.page}>
            <button onClick={handleClick} className={styles.button}>
                他の猫も見る
            </button>
            <div className={styles.frame}>
                {loading || <img src={imageUrl} className={styles.img} />}
            </div>
        </div>
    );
    // ローディング中でなければ、画像を表示する
    // JSXの式には、IFなどの文が使えないので、論理演算や三項演算子を使う
    // return <div>{loading || <img src={imageUrl} />}</div>;
    // or  {loading ? "読み込み中" : <img src="..." />} など
};

// IndexPage 関数を、ページコンポーネントとして認識させる
export default IndexPage;

// リダイレクトされるごとに、サーバーサイドで実行される関数
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    // 画像を取得
    const image = await fetchImage();
    return {
        // 小文字にして Props をインスタンス化して構造体を返す必要がある。
        props: {
            initialImageUrl: image.url,
        },
    };
};

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
