/**
 * 郵便番号のバリデーション関数
 * @param {string} postcode - 検証する郵便番号
 * @returns {boolean} - 有効な郵便番号かどうか
 */
export function validatePostcode(postcode) {
  // 7桁の数字のみを許可
  const postcodeRegex = /^\d{7}$/;
  return postcodeRegex.test(postcode);
}

/**
 * 郵便番号から住所を検索する関数
 * @param {string} postcode - 検索する郵便番号
 * @returns {Promise<Object>} - 検索結果オブジェクト
 */
export async function searchAddressByPostcode(postcode) {
  // 郵便番号のバリデーション
  if (!validatePostcode(postcode)) {
    return {
      success: false,
      error: '無効な郵便番号です'
    };
  }

  try {
    // ZipCloud APIを使用して住所を検索
    const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postcode}`);

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();

    // APIレスポンスの確認
    if (data.status !== 200) {
      return {
        success: false,
        error: '該当する住所が見つかりませんでした'
      };
    }

    if (!data.results || data.results.length === 0) {
      return {
        success: false,
        error: '該当する住所が見つかりませんでした'
      };
    }

    // 住所を整形
    const result = data.results[0];
    const address = `${result.address1} ${result.address2} ${result.address3}`;

    return {
      success: true,
      address: address
    };

  } catch (error) {
    return {
      success: false,
      error: '通信に失敗しました'
    };
  }
}

/**
 * Google Mapsで住所を開く関数
 * @param {string} address - 開く住所
 */
export function openInGoogleMaps(address) {
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  // 新しいタブでGoogle Mapsを開く
  window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
}

/**
 * 確認ダイアログを表示してGoogle Mapsを開く関数
 * @param {string} address - 開く住所
 */
export function confirmAndOpenGoogleMaps(address) {
  const message = `Google Mapsで「${address}」の位置を表示しますか？\n\n新しいタブでGoogle Mapsが開きます。`;

  if (confirm(message)) {
    openInGoogleMaps(address);
  }
}

/**
 * DOM要素を更新する関数
 * @param {string} elementId - 更新する要素のID
 * @param {string} content - 表示する内容
 * @param {string} type - 表示タイプ（success, error, loading, default）
 */
export function updateElement(elementId, content, type = 'default') {
  const element = document.getElementById(elementId);

  if (element) {
    element.textContent = content;

    // 既存のクラスをクリア
    element.className = 'result';

    // タイプに応じてクラスを追加
    if (type !== 'default') {
      element.classList.add(type);
    }

    // 成功時はクリックイベントを追加
    if (type === 'success') {
      element.onclick = () => confirmAndOpenGoogleMaps(content);
      element.title = 'クリックしてGoogle Mapsで表示';
      element.style.cursor = 'pointer';
    } else {
      element.onclick = null;
      element.title = '';
      element.style.cursor = 'default';
    }
  }
}

/**
 * 郵便番号入力時のイベントハンドラー
 * @param {Event} event - 入力イベント
 */
export async function handlePostcodeInput(event) {
  const postcode = event.target.value;

  // 結果表示エリアをクリア
  updateElement('result', '郵便番号を入力してください', 'default');

  // 7桁になったら検索実行
  if (postcode.length === 7) {
    updateElement('result', '検索中...', 'loading');

    try {
      const result = await searchAddressByPostcode(postcode);

      if (result.success) {
        updateElement('result', result.address, 'success');
      } else {
        updateElement('result', result.error, 'error');
      }
    } catch (error) {
      updateElement('result', `エラーが発生しました: ${error.message}`, 'error');
    }
  } else if (postcode.length > 0) {
    updateElement('result', `${postcode.length}/7 桁入力中...`, 'default');
  }
}
