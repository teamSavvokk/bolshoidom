const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      message: 'Метод не разрешён'
    });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!supabaseUrl) {
      return res.status(500).json({
        ok: false,
        message: 'Не задан SUPABASE_URL'
      });
    }

    if (!supabaseKey) {
      return res.status(500).json({
        ok: false,
        message: 'Не задан SUPABASE_SERVICE_ROLE_KEY'
      });
    }

    if (!telegramBotToken) {
      return res.status(500).json({
        ok: false,
        message: 'Не задан TELEGRAM_BOT_TOKEN'
      });
    }

    if (!telegramChatId) {
      return res.status(500).json({
        ok: false,
        message: 'Не задан TELEGRAM_CHAT_ID'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { firstname, email, number, topic, message } = req.body;

    if (!firstname || !email || !number) {
      return res.status(400).json({
        ok: false,
        message: 'Заполните обязательные поля: имя, email и телефон'
      });
    }

    const trimmedName = String(firstname).trim();
    const trimmedEmail = String(email).trim();
    const trimmedPhone = String(number).trim();
    const trimmedTopic = String(topic || 'Обратная связь').trim();
    const trimmedMessage = String(message || '').trim();

    let clientId = null;

    const { data: existingClient, error: searchError } = await supabase
      .from('Clients')
      .select('id_clients')
      .eq('email', trimmedEmail)
      .limit(1);

    if (searchError) {
      throw searchError;
    }

    if (existingClient && existingClient.length > 0) {
      clientId = existingClient[0].id_clients;
    } else {
      const { data: newClient, error: clientInsertError } = await supabase
        .from('Clients')
        .insert([
          {
            firstname: trimmedName,
            lastname: '',
            email: trimmedEmail,
            number: trimmedPhone
          }
        ])
        .select();

      if (clientInsertError) {
        throw clientInsertError;
      }

      clientId = newClient[0].id_clients;
    }

    const { error: feedbackInsertError } = await supabase
      .from('feedback_requests')
      .insert([
        {
          id_clients: clientId,
          topic: trimmedTopic,
          message: trimmedMessage
        }
      ]);

    if (feedbackInsertError) {
      throw feedbackInsertError;
    }

    const telegramText =
      `📩 Новая заявка с сайта "Большой Дом"\n\n` +
      `👤 Имя: ${trimmedName}\n` +
      `📧 Email: ${trimmedEmail}\n` +
      `📞 Телефон: ${trimmedPhone}\n` +
      `🛠 Услуга: ${trimmedTopic}\n` +
      `💬 Сообщение: ${trimmedMessage || '—'}\n`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: telegramText
        })
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      throw new Error(
        telegramResult.description || 'Ошибка отправки сообщения в Telegram'
      );
    }

    return res.status(200).json({
      ok: true,
      message: 'Обращение успешно отправлено'
    });
  } catch (error) {
    console.error('API feedback error:', error);

    return res.status(500).json({
      ok: false,
      message: 'Ошибка сервера',
      error: error.message
    });
  }
};
