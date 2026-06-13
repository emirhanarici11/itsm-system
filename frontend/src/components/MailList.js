import React from 'react';

function MailList({ mails, selectedId, onSelect }) {
  const priorityLabel = (p) => {
    if (p === 'high') return 'Yüksek';
    if (p === 'med') return 'Orta';
    return 'Düşük';
  };

  const statusLabel = (s) => {
    if (s === 'open') return 'Açık';
    if (s === 'closed') return 'Kapalı';
    return 'Beklemede';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>Gelen Kutusu</span>
        <span style={styles.count}>{mails.filter(m => m.unread).length} okunmamış</span>
      </div>
      {mails.map(mail => (
        <div
          key={mail.id}
          onClick={() => onSelect(mail.id)}
          style={{
            ...styles.item,
            backgroundColor: selectedId === mail.id ? '#e8f0fe' : '#fff',
            borderLeft: selectedId === mail.id ? '3px solid #1a73e8' : '3px solid transparent',
            fontWeight: mail.unread ? 'bold' : 'normal'
          }}
        >
          <div style={styles.itemTop}>
            <span style={styles.sender}>{mail.sender}</span>
            <span style={styles.time}>
              {new Date(mail.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div style={styles.subject}>{mail.subject}</div>
          <div style={styles.itemBottom}>
            <span style={{
              ...styles.tag,
              backgroundColor: mail.priority === 'high' ? '#fce8e6' : mail.priority === 'med' ? '#fef7e0' : '#e8f5e9',
              color: mail.priority === 'high' ? '#c5221f' : mail.priority === 'med' ? '#b06000' : '#2e7d32'
            }}>
              {priorityLabel(mail.priority)}
            </span>
            <span style={{
              ...styles.tag,
              backgroundColor: mail.status === 'open' ? '#fef7e0' : mail.status === 'closed' ? '#e8f5e9' : '#f1f3f4',
              color: mail.status === 'open' ? '#b06000' : mail.status === 'closed' ? '#2e7d32' : '#5f6368'
            }}>
              {statusLabel(mail.status)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { width: '300px', borderRight: '1px solid #e0e0e0', overflowY: 'auto', height: '100vh' },
  header: { padding: '16px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: '14px', fontWeight: '600', color: '#202124' },
  count: { fontSize: '12px', color: '#1a73e8', backgroundColor: '#e8f0fe', padding: '2px 8px', borderRadius: '10px' },
  item: { padding: '12px 16px', borderBottom: '1px solid #f1f3f4', cursor: 'pointer' },
  itemTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  sender: { fontSize: '13px', color: '#202124' },
  time: { fontSize: '11px', color: '#5f6368' },
  subject: { fontSize: '12px', color: '#5f6368', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  itemBottom: { display: 'flex', gap: '6px' },
  tag: { fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }
};

export default MailList;