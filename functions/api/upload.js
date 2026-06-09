// Cloudflare Pages Function - 微信公众号图片上传
// 环境变量：WECHAT_APPID, WECHAT_APPSECRET

export async function onRequestPost(context) {
  const { WECHAT_APPID, WECHAT_APPSECRET } = context.env;

  if (!WECHAT_APPID || !WECHAT_APPSECRET) {
    return new Response(JSON.stringify({ error: '缺少环境变量配置' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await context.request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ error: '未找到文件' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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

    // Step 2: 上传图片
    const uploadUrl = `https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=${accessToken}`;
    const uploadForm = new FormData();
    uploadForm.append('media', file, file.name || 'image.png');

    const uploadResp = await fetch(uploadUrl, {
      method: 'POST',
      body: uploadForm,
    });
    const uploadData = await uploadResp.json();

    if (!uploadData.url) {
      return new Response(JSON.stringify({ error: '上传失败', detail: uploadData }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ url: uploadData.url }), {
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

// CORS 支持
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
