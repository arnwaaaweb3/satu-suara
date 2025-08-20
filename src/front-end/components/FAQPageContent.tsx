// src/components/FAQPageContent.tsx

import React from "react";
import styles from "../styles/CentralPage.module.css";

const faqData = [
  {
    question: "Apa itu SatuSuara?",
    answer: "SatuSuara adalah platform voting komunitas yang dibangun di atas teknologi blockchain Algorand. Kami memberikan ruang bagi komunitas untuk menyuarakan pendapat dan membuat keputusan bersama secara transparan dan aman, layaknya sebuah Decentralized Autonomous Organization (DAO)."
  },
  {
    question: "Mengapa SatuSuara dibangun di atas Algorand?",
    answer: "Algorand dipilih karena beberapa keunggulannya, seperti biaya transaksi (gas fee) yang sangat rendah, kecepatan transaksi yang luar biasa, dan keamanan yang terjamin. Ini memastikan setiap voting dapat dilakukan dengan efisien dan tanpa hambatan."
  },
  {
    question: "Bagaimana cara kerja sistem voting di sini?",
    answer: "Setiap voting dicatat secara permanen dan transparan di blockchain Algorand. Setiap vote adalah aset digital unik yang tidak bisa diubah. Hasil voting akan dihitung secara otomatis oleh smart contract, memastikan keabsahan dan keadilan hasilnya."
  },
  {
    question: "Apakah setiap orang bisa mengajukan voting?",
    answer: "Ya! SatuSuara mengadopsi prinsip desentralisasi. Setelah memenuhi kriteria tertentu, setiap anggota komunitas dapat mengajukan ide untuk voting. Ini memberdayakan setiap orang untuk menjadi bagian dari proses pengambilan keputusan."
  },
  {
    question: "Apakah voting saya aman dan anonim?",
    answer: "Voting kamu aman karena dicatat di blockchain. Sementara itu, untuk anonimitas, setiap vote terhubung ke alamat wallet, bukan identitas pribadi. Jadi, meskipun vote terekam publik, tidak ada yang bisa melacaknya kembali ke identitas aslimu."
  },
];

const FAQPageContent: React.FC = () => {
  return (
    <div className={styles.contentInside}>
      <h2>Tanya Jawab (FAQ)</h2>
      <div className={styles.faqList}>
        {faqData.map((item, index) => (
          <div key={index} className={styles.faqItem}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPageContent;