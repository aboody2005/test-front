'use client';
import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { useTranslation } from '@/context/LanguageContext';

export default function AdminLocations() {
  const { locale, t } = useTranslation();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', city: '', region: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await api.locations.list();
      setLocations(data.locations || []);
    }
    catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      load();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', city: '', region: '' });
    setModal(true);
  };

  const openEdit = (loc) => {
    setEditItem(loc);
    setForm({ name: loc.name, city: loc.city, region: '' });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await api.locations.update(editItem._id, form);
        toast.success(locale === 'ar' ? 'تم تحديث الموقع بنجاح' : 'Location updated');
      } else {
        await api.locations.create(form);
        toast.success(locale === 'ar' ? 'تم إضافة الموقع بنجاح' : 'Location added');
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(locale === 'ar' ? `هل تريد حذف "${name}"؟` : `Delete "${name}"?`)) return;
    try {
      await api.locations.delete(id);
      toast.success(locale === 'ar' ? 'تم حذف الموقع بنجاح' : 'Location deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="page-header flex-between" style={{flexWrap:'wrap',gap:12}}>
        <div>
          <h1>{t('sideLocations')}</h1>
          <p className="text-muted">
            {locale === 'ar' ? 'إدارة مواقع صيدليات التدريب' : 'Manage training pharmacy locations'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + {t('addLocation')}
        </button>
      </div>

      {loading ? (
        <div className="flex-center" style={{height:200}}><div className="spinner" /></div>
      ) : (
        <div className="table-wrapper card" style={{padding:0}}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '80px', textAlign: 'center' }}>#</th>
                <th style={{ width: '180px', textAlign: 'center' }}>{t('cityLabel')}</th>
                <th style={{ textAlign: 'center' }}>{locale === 'ar' ? 'اسم الصيدلية' : 'Pharmacy Name'}</th>
                <th style={{ width: '220px', textAlign: 'left', paddingLeft: '24px' }}>{locale === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {locations.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{textAlign:'center',padding:'32px',color:'var(--text-muted)'}}>
                    {locale === 'ar' ? 'لا توجد مواقع بعد.' : 'No locations yet.'}
                  </td>
                </tr>
              ) : (
                locations.map((l, i) => (
                  <tr key={l._id}>
                    <td className="text-muted" style={{ textAlign: 'center' }}>{i + 1}</td>
                    <td style={{ textAlign: 'center' }}>{l.city}</td>
                    <td style={{fontWeight:600, textAlign: 'center'}}>{l.name}</td>
                    <td style={{ whiteSpace: 'nowrap', textAlign: 'left', paddingLeft: '24px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(l)} style={{ marginRight: 4, marginLeft: 4 }}>
                        ✏️ {locale === 'ar' ? 'تعديل' : 'Edit'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(l._id, l.name)} style={{ marginRight: 4, marginLeft: 4 }}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h4>{editItem ? t('editLocation') : t('addLocation')}</h4>
              <button onClick={() => setModal(false)} className="btn btn-icon btn-secondary">✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'block' }}>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label" style={{ color: 'var(--text-secondary)' }}>
                    {t('cityLabel')} *
                  </label>
                  <input
                    className="form-control"
                    placeholder={locale === 'ar' ? 'مثال: الموصل' : 'e.g. Mosul'}
                    value={form.city}
                    onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label" style={{ color: 'var(--text-secondary)' }}>
                    {locale === 'ar' ? 'اسم الصيدلية' : 'Pharmacy Name'} *
                  </label>
                  <input
                    className="form-control"
                    placeholder={locale === 'ar' ? 'مثال: صيدلية النور' : 'e.g. Al-Zuhour'}
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>
                  {t('cancel')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? (locale === 'ar' ? 'جاري الحفظ...' : 'Saving...') : editItem ? (locale === 'ar' ? 'تعديل' : 'Update') : t('addLocation')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
