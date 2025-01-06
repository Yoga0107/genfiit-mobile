export const submitReport = async (token: string, userID: string, materialID: string, answers: any[]) => {
    const response = await fetch('https://api-genfiit.yanginibeda.web.id/api/reports', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          users_permissions_user: userID,
          material_uuid: materialID,
          answer: answers,
        },
      }),
    });
  
    const data = await response.json();
    return data;
  };
  