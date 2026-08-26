import React, { useState, useEffect, useMemo } from 'react';
// App.cssは後ほど作成します
import './App.css';

// 型定義：都市のデータ
interface CityData {
  name: string;       // 表示名（日本語）
  timeZone: string;   // IANAタイムゾーン識別子 (例: 'Asia/Tokyo')
  flag: string;       // 国旗の絵文字
}

// 世界時計の選択肢リスト
const WORLD_CITIES: CityData[] = [
  { name: '東京 (Tokyo)', timeZone: 'Asia/Tokyo', flag: '🇯🇵' },
  { name: 'ロンドン (London)', timeZone: 'Europe/London', flag: '🇬🇧' },
  { name: 'ニューヨーク (New York)', timeZone: 'America/New_York', flag: '🇺🇸' },
  { name: 'パリ (Paris)', timeZone: 'Europe/Paris', flag: '🇫🇷' },
];

export default function App() {
  // 1. 状態管理 (State)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [selectedCity, setSelectedCity] = useState<CityData>(WORLD_CITIES[0]); // 初期値は東京

  // 2. 副作用フック (Effect) - 1秒ごとに現在時刻を更新
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // クリーンアップ関数（コンポーネントがアンマウントされたときにタイマーを解除）
    return () => clearInterval(timerId);
  }, []);

  // 3. 時刻フォーマット関数
  const formatTimeForTimeZone = (date: Date, timeZone: string): string => {
    return date.toLocaleTimeString('ja-JP', {
      timeZone: timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 24時間表示
    });
  };

  const formatDateForTimeZone = (date: Date, timeZone: string): string => {
    return date.toLocaleDateString('ja-JP', {
      timeZone: timeZone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  // 4. 計算された値 (useMemo) - 選択された都市の現在時刻
  const selectedCityTimeStr = useMemo(() => {
    return formatTimeForTimeZone(currentTime, selectedCity.timeZone);
  }, [currentTime, selectedCity]);

  const selectedCityDateStr = useMemo(() => {
    return formatDateForTimeZone(currentTime, selectedCity.timeZone);
  }, [currentTime, selectedCity]);

  // 現在地の時刻（ブラウザ設定依存）
  const localTimeStr = useMemo(() => {
    return currentTime.toLocaleTimeString('ja-JP', { hour12: false });
  }, [currentTime]);

  const localDateStr = useMemo(() => {
    return currentTime.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  }, [currentTime]);


  return (
    // コンテナ全体に「ピンクの柄」のクラスを適用
    <div className="pink-world-clock-container">
      
      {/* ヘッダー（ERIのサイン） */}
      <header className="clock-header">
        <div className="eri-sign">ERI</div>
        <div className="subtitle">World Clock ✨</div>
      </header>

      <main className="clock-main">
        
        {/* 現在地の時計カード */}
        <section className="clock-card local-clock">
          <h3>📍 あなたの現在地</h3>
          <div className="date-display">{localDateStr}</div>
          <div className="time-display digital-font">{localTimeStr}</div>
        </section>

        <hr className="divider" />

        {/* 世界時計の選択・表示カード */}
        <section className="clock-card world-clock">
          <h3>🌐 世界各地の時刻</h3>
          
          {/* プルダウンメニュー */}
          <div className="city-selector-wrapper">
            <select 
              value={selectedCity.timeZone} 
              onChange={(e) => {
                const city = WORLD_CITIES.find(c => c.timeZone === e.target.value);
                if (city) setSelectedCity(city);
              }}
              className="city-select"
            >
              {WORLD_CITIES.map((city) => (
                <option key={city.timeZone} value={city.timeZone}>
                  {city.flag} {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* 選択された都市の時刻表示 */}
          <div className="selected-city-display">
            <div className="date-display">{selectedCityDateStr}</div>
            <div className="time-display digital-font large-time">
              {selectedCityTimeStr}
            </div>
          </div>
        </section>

      </main>

      <footer className="clock-footer">
        <p>Customized for ERI 💕</p>
      </footer>
    </div>
  );
}