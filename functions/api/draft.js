// Cloudflare Pages Function - 微信公众号草稿箱上传
// 环境变量：WECHAT_APPID, WECHAT_APPSECRET

// 默认封面图（1x1 像素的透明 PNG）
const DEFAULT_COVER_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export async function onRequestPost(context) {
  const { WECHAT_APPID, WECHAT_APPSECRET } = context.env;

  if (!WECHAT_APPID || !WECHAT_APPSECRET) {
    return new Response(JSON.stringify({ error: '缺少环境变量配置' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await context.request.json();
    
    if (!body.content) {
      return new Response(JSON.stringify({ error: '请提供 content 参数' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const title = body.title || '未命名文章';
    let thumbMediaId = undefined;

    // Step 1: 获取 access_token
    const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WECHAT_APPID}&secret=${WECHAT_APPSECRET}`;
    const tokenResp = await fetch(tokenUrl);
    const tokenData = await tokenResp.json();

    if (!tokenData.access_token) {
      return new Response(JSON.stringify({ error: '获取 access_token 失败', detail: tokenData }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const accessToken = tokenData.access_token;

    // Step 2: 上传封面图
    if (body.coverUrl) {
      try {
        thumbMediaId = await uploadCoverImage(accessToken, body.coverUrl);
      } catch (err) {
        console.warn('封面上传失败，使用默认封面:', err.message);
      }
    }
    
    // 如果没有封面图，上传一个默认封面
    if (!thumbMediaId) {
      try {
        thumbMediaId = await uploadDefaultCover(accessToken);
      } catch (err) {
        console.warn('默认封面上传失败:', err.message);
        return new Response(JSON.stringify({ error: '封面图上传失败', detail: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Step 3: 创建草稿
    const draftUrl = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`;
    
    const article = {
      title,
      content: body.content,
      thumb_media_id: thumbMediaId,
      author: body.author || '',
      digest: body.digest || '',
      need_open_comment: 1,
      only_fans_can_comment: 0,
    };
    
    const draftResp = await fetch(draftUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles: [article] }),
    });
    const draftData = await draftResp.json();

    if (!draftData.media_id) {
      return new Response(JSON.stringify({ error: '创建草稿失败', detail: draftData }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      media_id: draftData.media_id,
      title,
      cover_uploaded: !!body.coverUrl,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// 上传默认封面图
async function uploadDefaultCover(accessToken) {
  // 将 base64 转换为 ArrayBuffer
  const binaryString = atob(DEFAULT_COVER_BASE64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const formData = new FormData();
  const blob = new Blob([bytes], { type: 'image/png' });
  formData.append('media', blob, 'default_cover.png');

  const uploadUrl = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${accessToken}&type=image`;
  const uploadResp = await fetch(uploadUrl, { method: 'POST', body: formData });
  const data = await uploadResp.json();

  if (!data.media_id) {
    throw new Error(`上传默认封面失败: ${data.errmsg || '未知错误'}`);
  }

  return data.media_id;
}

// 上传封面图片
async function uploadCoverImage(accessToken, imageUrl) {
  // 下载图片
  const imageResp = await fetch(imageUrl);
  if (!imageResp.ok) {
    throw new Error(`下载图片失败: ${imageResp.statusText}`);
  }

  const imageBuffer = await imageResp.arrayBuffer();
  const urlParts = imageUrl.split('/');
  const lastPart = urlParts[urlParts.length - 1]?.split('?')[0] || '';
  const ext = lastPart.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = lastPart || `cover.${ext}`;

  // 上传到微信素材库
  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: `image/${ext}` });
  formData.append('media', blob, filename);

  const uploadUrl = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${accessToken}&type=image`;
  const uploadResp = await fetch(uploadUrl, { method: 'POST', body: formData });
  const data = await uploadResp.json();

  if (!data.media_id) {
    throw new Error(`上传图片失败: ${data.errmsg || '未知错误'}`);
  }

  return data.media_id;
}

// 测试连接
export async function onRequestGet(context) {
  const { WECHAT_APPID, WECHAT_APPSECRET } = context.env;

  if (!WECHAT_APPID || !WECHAT_APPSECRET) {
    return new Response(JSON.stringify({ success: false, message: '缺少环境变量配置' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WECHAT_APPID}&secret=${WECHAT_APPSECRET}`;
    const tokenResp = await fetch(tokenUrl);
    const tokenData = await tokenResp.json();

    if (tokenData.access_token) {
      return new Response(JSON.stringify({ success: true, message: '连接成功' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: '连接失败', detail: tokenData }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err.message }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// CORS 支持
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
