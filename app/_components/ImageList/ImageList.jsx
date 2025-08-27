import React from "react";
import { Parallax } from "../Parallax/Parallax";
import Image from "next/image";
import styles from "./ImageList.module.scss";

const ImageList = () => {
  return (
    <div className={styles.container}>
      <Parallax speed={5} className={styles.imageStart}>
        <Image
          src={"https://picsum.photos/600/400?random=1"}
          alt="Image"
          width={600}
          height={400}
          priority
          sizes="50vw"
        />
      </Parallax>

      <Parallax speed={-2} className={`${styles.imageEnd} ${styles.imageCutoff}`}>
        <Image
          src={"https://picsum.photos/600/400?random=2"}
          alt="Image"
          width={600}
          height={400}
          priority
          sizes="50vw"
        />
      </Parallax>

      <Parallax speed={-10} className={styles.imageCenter}>
        <Image
          src={"https://picsum.photos/400/600?random=3"}
          alt="Image"
          width={400}
          height={600}
          sizes="50vw"
        />
      </Parallax>

      <Image
        src={"https://picsum.photos/600/400?random=4"}
        alt="Image"
        width={600}
        height={400}
        sizes="50vw"
      />
      <Image
        src={"https://picsum.photos/600/400?random=5"}
        alt="Image"
        width={600}
        height={400}
        sizes="50vw"
      />
    </div>
  );
};

export default ImageList;