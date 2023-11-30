import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import { QRCode } from "react-qrcode-logo";
import styled from "styled-components";

const ID = "react-qrcode-logo";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: scroll;
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 12px 20px;
  font-size: 16px;
  flex-shrink: 0;
  flex-grow: 0;
`;

const Label = styled.label<{ label?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  z-index: 0;
  position: relative;
  & > * {
    z-index: 0;
  }
  &:before {
    position: absolute;
    top: 0;
    left: 10px;
    transform: translate(0, -50%);
    content: "${(props) => props.label}";
    z-index: 1;
    background: #fff;
    padding: 0 10px;
  }
`;
const Header = styled.h1``;
const Text = styled.p`
  text-align: center;
  white-space: pre-wrap;
`;

const Img = styled.a<{ href: string }>`
  width: 200px;
  height: 200px;
  display: block;
  background: #fff;
  background-image: url(${(props) => props.href});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

function App() {
  const [url, setURL] = useState<string>("");
  const [icon, setIcon] = useState<File | null>(null);
  const [iconUrl, setIconUrl] = useState<string | undefined>();
  const [width, setWidth] = useState<number>(100);
  const [height, setHeight] = useState<number>(100);
  const [imageLink, setImageLink] = useState<string | undefined>();
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!icon) return;
    setIconUrl(URL.createObjectURL(icon));
    (async () => {
      const i = await loadImage(icon);
      const width = i.width;
      const height = i.height;
      if (width > height) {
        setWidth(50);
        setHeight(50 * (height / width));
      } else {
        setHeight(50);
        setWidth(50 * (width / height));
      }
    })();
  }, [icon]);

  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return alert("ファイルを選択してください");
    }

    setIcon(file);
  };

  const getCanvas = (): HTMLCanvasElement | undefined => {
    const canvas = document.getElementById(ID) as HTMLCanvasElement;
    if (!canvas) return undefined;

    return canvas;
  };

  const genImageLink = useCallback(async () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const ref = canvas.toDataURL("image/png");
    setImageLink(ref);
  }, []);
  useEffect(() => {
    genImageLink();
  }, [count, genImageLink]);

  useEffect(() => {
    setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);
  }, [setCount]);

  return (
    <Container>
      <Header>QRコードジェネレーター</Header>
      <Text>{"QRコードのジェネレーターです"}</Text>
      <Label label={"URL"}>
        <Input value={url} onChange={(e) => setURL(e.target.value)} />
      </Label>
      <Label label={"アイコン"}>
        <Input
          onChange={handleFileChange}
          type="file"
          accept="image/png, image/jpeg"
        />
      </Label>
      {url && (
        <span style={{ display: "none" }}>
          <QRCode
            value={url}
            logoImage={iconUrl}
            logoWidth={width}
            logoHeight={height}
            size={200}
            ecLevel="H"
            id={ID}
          />
        </span>
      )}
      <Img href={imageLink || ""} download />
    </Container>
  );
}

export default App;
