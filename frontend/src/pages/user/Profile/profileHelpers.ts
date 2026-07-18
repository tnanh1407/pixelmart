import Swal from 'sweetalert2'
import api from "@/services/client"

// ── Swal Config Constants ──────────────────────────────────────────

export const SIMPLE_SWAL_CONFIG = {
  showCancelButton: true,
  confirmButtonText: 'Xác nhận',
  cancelButtonText: 'Hủy',
  confirmButtonColor: '#049645',
  cancelButtonColor: '#6b7280',
  customClass: {
    popup: '!rounded-xl',
    confirmButton: '!rounded-lg !px-6 !ml-2',
    cancelButton: '!rounded-lg !px-6',
    actions: '!gap-2',
  },
}

export const ADDRESS_SWAL_CONFIG = {
  showCancelButton: true,
  confirmButtonText: 'Lưu địa chỉ',
  cancelButtonText: 'Hủy',
  confirmButtonColor: '#049645',
  cancelButtonColor: '#6b7280',
  customClass: {
    popup: '!rounded-2xl max-w-4xl',
    confirmButton: '!rounded-xl !px-6 !py-2.5 !text-sm !font-semibold',
    cancelButton: '!rounded-xl !px-6 !py-2.5 !text-sm !font-semibold',
    actions: '!gap-2',
  },
}

export const SUCCESS_ALERT = (text: string) =>
  Swal.fire({ icon: 'success', title: 'Thành công!', text, confirmButtonColor: '#049645' })

export const ERROR_ALERT = (text: string) =>
  Swal.fire({ icon: 'error', title: 'Lỗi', text, confirmButtonColor: '#049645' })

export const LOADING_ALERT = (title = 'Đang tải dữ liệu...') =>
  Swal.fire({ title, allowOutsideClick: false, didOpen: () => Swal.showLoading() })

// ── normalizeAndFind ───────────────────────────────────────────────

export const normalizeAndFind = (list: any[], nameToFind: string) => {
  if (!nameToFind) return null
  const cleanedFind = nameToFind.toLowerCase()
    .replace(/^(thành phố|tỉnh|quận|huyện|thị xã|thị trấn|phường|xã)\s+/gi, '')
    .trim()

  let found = list.find(item => item.name.toLowerCase() === nameToFind.toLowerCase())
  if (found) return found

  found = list.find(item => {
    const cleanedItem = item.name.toLowerCase()
      .replace(/^(thành phố|tỉnh|quận|huyện|thị xã|thị trấn|phường|xã)\s+/gi, '')
      .trim()
    return cleanedItem === cleanedFind
  })
  return found
}

// ── showProfileFieldPopup ──────────────────────────────────────────

interface ProfileFieldPopupOptions {
  title: string
  html: string
  preConfirm: () => false | Record<string, any>
  onSuccess?: (formValues: Record<string, any>) => Promise<void>
  successMessage: string
  errorMessage: string
}

export async function showProfileFieldPopup({
  title,
  html,
  preConfirm,
  onSuccess,
  successMessage,
  errorMessage,
}: ProfileFieldPopupOptions) {
  const { value: formValues } = await Swal.fire({
    title,
    html,
    ...SIMPLE_SWAL_CONFIG,
    preConfirm,
  })

  if (formValues) {
    try {
      if (onSuccess) await onSuccess(formValues)
      SUCCESS_ALERT(successMessage)
    } catch (err: any) {
      ERROR_ALERT(err?.response?.data?.message || errorMessage)
    }
  }
}

// ── Address Form HTML ──────────────────────────────────────────────

interface AddressFormHtmlOptions {
  provinces: any[]
  activeDistricts: any[]
  activeWards: any[]
  address?: {
    receiverName?: string
    receiverPhone?: string
    provinceName?: string
    districtName?: string
    wardName?: string
    streetAddress?: string
    isDefault?: boolean
  }
}

export function getAddressFormHtml({
  provinces,
  activeDistricts,
  activeWards,
  address,
}: AddressFormHtmlOptions) {
  const v = (val?: string) => val ? `value="${val}"` : ''
  const checked = address?.isDefault ? 'checked disabled' : ''
  const isEdit = !!address

  return `
    <div style="display: flex; flex-wrap: wrap; gap: 20px; text-align: left; padding: 10px 0; max-height: 70vh; overflow-y: auto;">
      <div style="flex: 1.2; min-width: 320px; display: flex; flex-direction: column; gap: 14px;">
        <div>
          <label style="display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:4px;">Tên người nhận <span style="color:#ef4444;">*</span></label>
          <input id="addr-name" type="text" ${v(address?.receiverName)} placeholder="Nhập tên người nhận"
            style="width:100%;padding:9px 12px;font-size:13px;border:1px solid #d1d5db;border-radius:8px;outline:none;box-sizing:border-box;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:4px;">Số điện thoại <span style="color:#ef4444;">*</span></label>
          <input id="addr-phone" type="text" ${v(address?.receiverPhone)} placeholder="Nhập số điện thoại"
            style="width:100%;padding:9px 12px;font-size:13px;border:1px solid #d1d5db;border-radius:8px;outline:none;box-sizing:border-box;" />
        </div>
        <div>
          <label style="display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:4px;">Tỉnh / Thành phố <span style="color:#ef4444;">*</span></label>
          <input id="addr-province" list="provinces-list" ${v(address?.provinceName)} placeholder="Nhập để tìm kiếm Tỉnh / Thành..."
            style="width:100%;padding:9px 12px;font-size:13px;border:1px solid #d1d5db;border-radius:8px;outline:none;box-sizing:border-box;background:#fff;" />
          <datalist id="provinces-list">
            ${provinces.map(p => `<option value="${p.name}"></option>`).join('')}
          </datalist>
        </div>
        <div>
          <label style="display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:4px;">Quận / Huyện <span style="color:#ef4444;">*</span></label>
          <input id="addr-district" list="districts-list" ${isEdit ? '' : 'disabled'} ${v(address?.districtName)} placeholder="Nhập để tìm kiếm Quận / Huyện..."
            style="width:100%;padding:9px 12px;font-size:13px;border:1px solid #d1d5db;border-radius:8px;outline:none;box-sizing:border-box;background:${isEdit ? '#fff' : '#f3f4f6'};" />
          <datalist id="districts-list">
            ${activeDistricts.map(d => `<option value="${d.name}"></option>`).join('')}
          </datalist>
        </div>
        <div>
          <label style="display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:4px;">Phường / Xã <span style="color:#ef4444;">*</span></label>
          <input id="addr-ward" list="wards-list" ${isEdit ? '' : 'disabled'} ${v(address?.wardName)} placeholder="Nhập để tìm kiếm Phường / Xã..."
            style="width:100%;padding:9px 12px;font-size:13px;border:1px solid #d1d5db;border-radius:8px;outline:none;box-sizing:border-box;background:${isEdit ? '#fff' : '#f3f4f6'};" />
          <datalist id="wards-list">
            ${activeWards.map(w => `<option value="${w.name}"></option>`).join('')}
          </datalist>
        </div>
        <div>
          <label style="display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:4px;">Địa chỉ cụ thể (Số nhà, tên đường...) <span style="color:#ef4444;">*</span></label>
          <input id="addr-street" type="text" ${v(address?.streetAddress)} placeholder="Ví dụ: 123 Đường Nguyễn Trãi"
            style="width:100%;padding:9px 12px;font-size:13px;border:1px solid #d1d5db;border-radius:8px;outline:none;box-sizing:border-box;" />
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
          <input id="addr-default" type="checkbox" ${checked} style="width:16px;height:16px;cursor:pointer;" />
          <label for="addr-default" style="font-size:13px;font-weight:500;color:#374151;cursor:pointer;user-select:none;">Đặt làm địa chỉ mặc định</label>
        </div>
      </div>

      <div style="flex: 1; min-width: 320px; display: flex; flex-direction: column; gap: 10px;">
        <button id="btn-gps" type="button"
          style="display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; border: none; background-color: #049645; color: white; font-size: 13px; padding: 10px 14px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background-color 0.2s;"
          onmouseover="this.style.backgroundColor='#007a3d'"
          onmouseout="this.style.backgroundColor='#049645'">
          📍 Sử dụng vị trí GPS hiện tại
        </button>
        <div id="goong-map-container" style="width: 100%; height: 350px; border-radius: 12px; overflow: hidden; border: 1px solid #d1d5db; position: relative; display: flex; align-items: center; justify-content: center; background-color: #f3f4f6;">
          <div id="goong-map" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"></div>
          <div id="map-error-msg" style="z-index: 1; color: #6b7280; font-size: 12px; display: flex; align-items: center; justify-content: center; padding: 20px; text-align: center; font-weight: 500; line-height: 1.5;">
             ⏳ Đang tải bản đồ Goong Map...
          </div>
        </div>
        <p style="font-size: 11px; color: #6b7280; text-align: center; margin: 0; line-height: 1.4;">
          * Bạn có thể click chọn trực tiếp trên bản đồ hoặc kéo thả Ghim (Marker) để định vị địa chỉ tự động.
        </p>
      </div>
    </div>
  `
}

// ── validateAddressForm ────────────────────────────────────────────

export function validateAddressForm(
  provinces: any[],
  activeDistricts: any[],
  activeWards: any[],
) {
  const receiverName = (document.getElementById('addr-name') as HTMLInputElement)?.value.trim()
  const receiverPhone = (document.getElementById('addr-phone') as HTMLInputElement)?.value.trim()
  const provinceName = (document.getElementById('addr-province') as HTMLInputElement)?.value.trim()
  const districtName = (document.getElementById('addr-district') as HTMLInputElement)?.value.trim()
  const wardName = (document.getElementById('addr-ward') as HTMLInputElement)?.value.trim()
  const streetAddress = (document.getElementById('addr-street') as HTMLInputElement)?.value.trim()
  const isDefault = (document.getElementById('addr-default') as HTMLInputElement)?.checked

  if (!receiverName || receiverName.length < 2) {
    Swal.showValidationMessage('Tên người nhận phải có ít nhất 2 ký tự')
    return false
  }
  if (!receiverPhone || !/^(0|\+84)[0-9]{9,10}$/.test(receiverPhone)) {
    Swal.showValidationMessage('Số điện thoại không hợp lệ')
    return false
  }

  const province = provinces.find(p => p.name.toLowerCase() === provinceName.toLowerCase())
  if (!province) {
    Swal.showValidationMessage('Vui lòng chọn Tỉnh / Thành phố từ danh sách gợi ý')
    return false
  }

  const district = activeDistricts.find(d => d.name.toLowerCase() === districtName.toLowerCase())
  if (!district) {
    Swal.showValidationMessage('Vui lòng chọn Quận / Huyện từ danh sách gợi ý')
    return false
  }

  const ward = activeWards.find(w => w.name.toLowerCase() === wardName.toLowerCase())
  if (!ward) {
    Swal.showValidationMessage('Vui lòng chọn Phường / Xã từ danh sách gợi ý')
    return false
  }

  if (!streetAddress || streetAddress.length < 5) {
    Swal.showValidationMessage('Địa chỉ cụ thể phải có ít nhất 5 ký tự')
    return false
  }

  return {
    receiverName,
    receiverPhone,
    provinceCode: province.code,
    provinceName: province.name,
    districtCode: district.code,
    districtName: district.name,
    wardCode: ward.code,
    wardName: ward.name,
    streetAddress,
    isDefault,
  }
}

// ── initAddressFormDidOpen ─────────────────────────────────────────

interface InitAddressFormParams {
  provinces: any[]
  activeDistricts: any[]
  activeWards: any[]
  setDistricts: (d: any[]) => void
  setWards: (w: any[]) => void
  goongjs: any
}

export function initAddressFormDidOpen({
  provinces,
  activeDistricts,
  setDistricts,
  setWards,
  goongjs,
}: InitAddressFormParams) {
  return () => {
    const provinceInput = document.getElementById('addr-province') as HTMLInputElement
    const districtInput = document.getElementById('addr-district') as HTMLInputElement
    const districtList = document.getElementById('districts-list') as HTMLDataListElement
    const wardInput = document.getElementById('addr-ward') as HTMLInputElement
    const wardList = document.getElementById('wards-list') as HTMLDataListElement
    const errorMsg = document.getElementById('map-error-msg')

    if (errorMsg) errorMsg.style.display = 'flex'

    provinceInput.addEventListener('input', async () => {
      const provName = provinceInput.value.trim()
      const province = provinces.find(p => p.name.toLowerCase() === provName.toLowerCase())

      districtInput.value = ''
      districtInput.disabled = true
      districtInput.style.backgroundColor = '#f3f4f6'
      districtList.innerHTML = ''
      setDistricts([])

      wardInput.value = ''
      wardInput.disabled = true
      wardInput.style.backgroundColor = '#f3f4f6'
      wardList.innerHTML = ''
      setWards([])

      if (!province) return

      try {
        const res = await api.get(`/addresses/districts?provinceCode=${province.code}`)
        const districts = res.data.data
        setDistricts(districts)
        districtList.innerHTML = districts.map((d: any) => `<option value="${d.name}"></option>`).join('')
        districtInput.disabled = false
        districtInput.style.backgroundColor = '#fff'
      } catch (err) {
        console.error(err)
      }
    })

    districtInput.addEventListener('input', async () => {
      const distName = districtInput.value.trim()
      const district = activeDistricts.find(d => d.name.toLowerCase() === distName.toLowerCase())

      wardInput.value = ''
      wardInput.disabled = true
      wardInput.style.backgroundColor = '#f3f4f6'
      wardList.innerHTML = ''
      setWards([])

      if (!district) return

      try {
        const res = await api.get(`/addresses/wards?districtCode=${district.code}`)
        const wards = res.data.data
        setWards(wards)
        wardList.innerHTML = wards.map((w: any) => `<option value="${w.name}"></option>`).join('')
        wardInput.disabled = false
        wardInput.style.backgroundColor = '#fff'
      } catch (err) {
        console.error(err)
      }
    })

    const mapKey = import.meta.env.VITE_GOONG_MAP_KEY
    const apiKey = import.meta.env.VITE_GOONG_API_KEY

    let map: any = null
    let marker: any = null

    setTimeout(() => {
      if (!goongjs) {
        if (errorMsg) errorMsg.innerHTML = '⚠️ Không thể tải Goong Maps SDK. Vui lòng kiểm tra kết nối mạng hoặc CDN.'
        return
      }
      if (!mapKey) {
        if (errorMsg) errorMsg.innerHTML = '⚠️ Thiếu VITE_GOONG_MAP_KEY trong file cấu hình .env'
        return
      }

      goongjs.accessToken = mapKey
      try {
        map = new goongjs.Map({
          container: 'goong-map',
          style: 'https://tiles.goong.io/assets/goong_map_web.json',
          center: [105.83991, 21.028],
          zoom: 13
        })

        map.on('load', () => {
          if (errorMsg) errorMsg.style.display = 'none'
          map.resize()
        })

        map.on('error', (e: any) => {
          console.error("Goong Map error event: ", e)
          if (errorMsg) {
            errorMsg.style.display = 'flex'
            errorMsg.innerHTML = '⚠️ Lỗi tải bản đồ Goong Map. Vui lòng kiểm tra tính hợp lệ của VITE_GOONG_MAP_KEY trong .env'
          }
        })

        marker = new goongjs.Marker({ draggable: true })
          .setLngLat([105.83991, 21.028])
          .addTo(map)

        const handleLocationSelect = async (lng: number, lat: number) => {
          marker.setLngLat([lng, lat])

          if (!apiKey) return
          try {
            const response = await fetch(`https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${apiKey}`)
            const data = await response.json()

            if (data.results && data.results.length > 0) {
              const result = data.results[0]
              const comp = result.compound
              const streetAddressInput = document.getElementById('addr-street') as HTMLInputElement

              if (comp) {
                const matchedProvince = normalizeAndFind(provinces, comp.province)
                if (matchedProvince) {
                  provinceInput.value = matchedProvince.name

                  const resDist = await api.get(`/addresses/districts?provinceCode=${matchedProvince.code}`)
                  const districts = resDist.data.data
                  setDistricts(districts)
                  districtList.innerHTML = districts.map((d: any) => `<option value="${d.name}"></option>`).join('')
                  districtInput.disabled = false
                  districtInput.style.backgroundColor = '#fff'

                  const matchedDistrict = normalizeAndFind(districts, comp.district)
                  if (matchedDistrict) {
                    districtInput.value = matchedDistrict.name

                    const resWard = await api.get(`/addresses/wards?districtCode=${matchedDistrict.code}`)
                    const wards = resWard.data.data
                    setWards(wards)
                    wardList.innerHTML = wards.map((w: any) => `<option value="${w.name}"></option>`).join('')
                    wardInput.disabled = false
                    wardInput.style.backgroundColor = '#fff'

                    const matchedWard = normalizeAndFind(wards, comp.ward)
                    if (matchedWard) {
                      wardInput.value = matchedWard.name
                    } else {
                      wardInput.value = ''
                    }
                  } else {
                    districtInput.value = ''
                    wardInput.value = ''
                    wardInput.disabled = true
                    wardInput.style.backgroundColor = '#f3f4f6'
                    wardList.innerHTML = ''
                  }
                } else {
                  provinceInput.value = ''
                  districtInput.value = ''
                  districtInput.disabled = true
                  districtInput.style.backgroundColor = '#f3f4f6'
                  districtList.innerHTML = ''
                  wardInput.value = ''
                  wardInput.disabled = true
                  wardInput.style.backgroundColor = '#f3f4f6'
                  wardList.innerHTML = ''
                }
              }

              if (streetAddressInput) {
                streetAddressInput.value = result.name || result.formatted_address || ''
              }
            }
          } catch (err) {
            console.error("Geocoding error: ", err)
          }
        }

        marker.on('dragend', () => {
          const lngLat = marker.getLngLat()
          handleLocationSelect(lngLat.lng, lngLat.lat)
        })

        map.on('click', (e: any) => {
          handleLocationSelect(e.lngLat.lng, e.lngLat.lat)
        })

        const gpsBtn = document.getElementById('btn-gps')
        if (gpsBtn) {
          gpsBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords
                  map.flyTo({ center: [longitude, latitude], zoom: 16 })
                  handleLocationSelect(longitude, latitude)
                },
                (error) => {
                  console.error("Geolocation error: ", error)
                  Swal.showValidationMessage('Không thể truy cập vị trí GPS. Vui lòng bật định vị thiết bị.')
                },
                { enableHighAccuracy: true }
              )
            } else {
              Swal.showValidationMessage('Trình duyệt không hỗ trợ dịch vụ GPS.')
            }
          })
        }

      } catch (mapErr) {
        console.error("Goong Map load error: ", mapErr)
        if (errorMsg) {
          errorMsg.style.display = 'flex'
          errorMsg.innerHTML = '⚠️ Không thể khởi tạo bản đồ Goong Map (WebGL hoặc Key không hợp lệ).'
        }
      }
    }, 300)
  }
}

// ── initEditAddressFormDidOpen ─────────────────────────────────────

interface InitEditAddressFormParams extends InitAddressFormParams {
  address: {
    streetAddress: string
    wardName: string
    districtName: string
    provinceName: string
  }
}

export function initEditAddressFormDidOpen({
  address,
  provinces,
  activeDistricts,
  setDistricts,
  setWards,
  goongjs,
}: InitEditAddressFormParams) {
  return () => {
    const provinceInput = document.getElementById('addr-province') as HTMLInputElement
    const districtInput = document.getElementById('addr-district') as HTMLInputElement
    const districtList = document.getElementById('districts-list') as HTMLDataListElement
    const wardInput = document.getElementById('addr-ward') as HTMLInputElement
    const wardList = document.getElementById('wards-list') as HTMLDataListElement
    const errorMsg = document.getElementById('map-error-msg')

    if (errorMsg) errorMsg.style.display = 'flex'

    provinceInput.addEventListener('input', async () => {
      const provName = provinceInput.value.trim()
      const province = provinces.find(p => p.name.toLowerCase() === provName.toLowerCase())

      districtInput.value = ''
      districtInput.disabled = true
      districtInput.style.backgroundColor = '#f3f4f6'
      districtList.innerHTML = ''
      setDistricts([])

      wardInput.value = ''
      wardInput.disabled = true
      wardInput.style.backgroundColor = '#f3f4f6'
      wardList.innerHTML = ''
      setWards([])

      if (!province) return

      try {
        const res = await api.get(`/addresses/districts?provinceCode=${province.code}`)
        const districts = res.data.data
        setDistricts(districts)
        districtList.innerHTML = districts.map((d: any) => `<option value="${d.name}"></option>`).join('')
        districtInput.disabled = false
        districtInput.style.backgroundColor = '#fff'
      } catch (err) {
        console.error(err)
      }
    })

    districtInput.addEventListener('input', async () => {
      const distName = districtInput.value.trim()
      const district = activeDistricts.find(d => d.name.toLowerCase() === distName.toLowerCase())

      wardInput.value = ''
      wardInput.disabled = true
      wardInput.style.backgroundColor = '#f3f4f6'
      wardList.innerHTML = ''
      setWards([])

      if (!district) return

      try {
        const res = await api.get(`/addresses/wards?districtCode=${district.code}`)
        const wards = res.data.data
        setWards(wards)
        wardList.innerHTML = wards.map((w: any) => `<option value="${w.name}"></option>`).join('')
        wardInput.disabled = false
        wardInput.style.backgroundColor = '#fff'
      } catch (err) {
        console.error(err)
      }
    })

    const mapKey = import.meta.env.VITE_GOONG_MAP_KEY
    const apiKey = import.meta.env.VITE_GOONG_API_KEY

    let map: any = null
    let marker: any = null

    setTimeout(async () => {
      if (!goongjs) {
        if (errorMsg) errorMsg.innerHTML = '⚠️ Không thể tải Goong Maps SDK. Vui lòng kiểm tra kết nối mạng hoặc CDN.'
        return
      }
      if (!mapKey) {
        if (errorMsg) errorMsg.innerHTML = '⚠️ Thiếu VITE_GOONG_MAP_KEY trong file cấu hình .env'
        return
      }

      goongjs.accessToken = mapKey
      try {
        let centerCoords: [number, number] = [105.83991, 21.028]

        if (apiKey) {
          try {
            const fullAddressStr = `${address.streetAddress}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`
            const geocodeRes = await fetch(`https://rsapi.goong.io/Geocode?address=${encodeURIComponent(fullAddressStr)}&api_key=${apiKey}`)
            const geocodeData = await geocodeRes.json()
            if (geocodeData.results && geocodeData.results.length > 0) {
              const loc = geocodeData.results[0].geometry.location
              centerCoords = [loc.lng, loc.lat]
            }
          } catch (geocodeErr) {
            console.error("Geocoding existing address error: ", geocodeErr)
          }
        }

        map = new goongjs.Map({
          container: 'goong-map',
          style: 'https://tiles.goong.io/assets/goong_map_web.json',
          center: centerCoords,
          zoom: 15
        })

        map.on('load', () => {
          if (errorMsg) errorMsg.style.display = 'none'
          map.resize()
        })

        map.on('error', (e: any) => {
          console.error("Goong Map error event: ", e)
          if (errorMsg) {
            errorMsg.style.display = 'flex'
            errorMsg.innerHTML = '⚠️ Lỗi tải bản đồ Goong Map. Vui lòng kiểm tra tính hợp lệ của VITE_GOONG_MAP_KEY trong .env'
          }
        })

        marker = new goongjs.Marker({ draggable: true })
          .setLngLat(centerCoords)
          .addTo(map)

        const handleLocationSelect = async (lng: number, lat: number) => {
          marker.setLngLat([lng, lat])

          if (!apiKey) return
          try {
            const response = await fetch(`https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${apiKey}`)
            const data = await response.json()

            if (data.results && data.results.length > 0) {
              const result = data.results[0]
              const comp = result.compound
              const streetAddressInput = document.getElementById('addr-street') as HTMLInputElement

              if (comp) {
                const matchedProvince = normalizeAndFind(provinces, comp.province)
                if (matchedProvince) {
                  provinceInput.value = matchedProvince.name

                  const resDist = await api.get(`/addresses/districts?provinceCode=${matchedProvince.code}`)
                  const districts = resDist.data.data
                  setDistricts(districts)
                  districtList.innerHTML = districts.map((d: any) => `<option value="${d.name}"></option>`).join('')
                  districtInput.disabled = false
                  districtInput.style.backgroundColor = '#fff'

                  const matchedDistrict = normalizeAndFind(districts, comp.district)
                  if (matchedDistrict) {
                    districtInput.value = matchedDistrict.name

                    const resWard = await api.get(`/addresses/wards?districtCode=${matchedDistrict.code}`)
                    const wards = resWard.data.data
                    setWards(wards)
                    wardList.innerHTML = wards.map((w: any) => `<option value="${w.name}"></option>`).join('')
                    wardInput.disabled = false
                    wardInput.style.backgroundColor = '#fff'

                    const matchedWard = normalizeAndFind(wards, comp.ward)
                    if (matchedWard) {
                      wardInput.value = matchedWard.name
                    } else {
                      wardInput.value = ''
                    }
                  } else {
                    districtInput.value = ''
                    wardInput.value = ''
                    wardInput.disabled = true
                    wardInput.style.backgroundColor = '#f3f4f6'
                    wardList.innerHTML = ''
                  }
                } else {
                  provinceInput.value = ''
                  districtInput.value = ''
                  districtInput.disabled = true
                  districtInput.style.backgroundColor = '#f3f4f6'
                  districtList.innerHTML = ''
                  wardInput.value = ''
                  wardInput.disabled = true
                  wardInput.style.backgroundColor = '#f3f4f6'
                  wardList.innerHTML = ''
                }
              }

              if (streetAddressInput) {
                streetAddressInput.value = result.name || result.formatted_address || ''
              }
            }
          } catch (err) {
            console.error("Geocoding error: ", err)
          }
        }

        marker.on('dragend', () => {
          const lngLat = marker.getLngLat()
          handleLocationSelect(lngLat.lng, lngLat.lat)
        })

        map.on('click', (e: any) => {
          handleLocationSelect(e.lngLat.lng, e.lngLat.lat)
        })

        const gpsBtn = document.getElementById('btn-gps')
        if (gpsBtn) {
          gpsBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords
                  map.flyTo({ center: [longitude, latitude], zoom: 16 })
                  handleLocationSelect(longitude, latitude)
                },
                (error) => {
                  console.error("Geolocation error: ", error)
                  Swal.showValidationMessage('Không thể truy cập vị trí GPS. Vui lòng bật định vị thiết bị.')
                },
                { enableHighAccuracy: true }
              )
            } else {
              Swal.showValidationMessage('Trình duyệt không hỗ trợ dịch vụ GPS.')
            }
          })
        }

      } catch (mapErr) {
        console.error("Goong Map load error: ", mapErr)
        if (errorMsg) {
          errorMsg.style.display = 'flex'
          errorMsg.innerHTML = '⚠️ Không thể khởi tạo bản đồ Goong Map (WebGL hoặc Key không hợp lệ).'
        }
      }
    }, 300)
  }
}

// ── loadGoongSDK ───────────────────────────────────────────────────

export const loadGoongSDK = (): Promise<any> => {
  return new Promise((resolve) => {
    if ((window as any).goongjs) {
      resolve((window as any).goongjs)
      return
    }

    if (!document.getElementById('goong-css')) {
      const link = document.createElement('link')
      link.id = 'goong-css'
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css'
      document.head.appendChild(link)
    }

    if (!document.getElementById('goong-js')) {
      const script = document.createElement('script')
      script.id = 'goong-js'
      script.src = 'https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.js'
      script.onload = () => {
        resolve((window as any).goongjs)
      }
      script.onerror = () => {
        console.error('Failed to load Goong Maps JS SDK')
        resolve(null)
      }
      document.head.appendChild(script)
    } else {
      const interval = setInterval(() => {
        if ((window as any).goongjs) {
          clearInterval(interval)
          resolve((window as any).goongjs)
        }
      }, 100)
    }
  })
}
