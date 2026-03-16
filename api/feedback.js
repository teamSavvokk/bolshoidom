const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      message: 'Метод не разрешён'
    });
  }

  try {
    // теперь принимаем поля как в форме
    const { firstname, email, number, topic, message } = req.body;

    if (!firstname || !email || !number) {
      return res.status(400).json({
        ok: false,
        message: 'Заполните обязательные поля: имя, email и телефон'
      });
    }

    const trimmedEmail = String(email).trim();
    const trimmedPhone = String(number).trim();
    const trimmedName = String(firstname).trim();

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
          topic: topic || 'Обратная связь',
          message: message || ''
        }
      ]);

    if (feedbackInsertError) {
      throw feedbackInsertError;
    }

    return res.status(200).json({
      ok: true,
      message: 'Обращение успешно отправлено'
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: 'Ошибка сервера',
      error: error.message
    });
  }
};
