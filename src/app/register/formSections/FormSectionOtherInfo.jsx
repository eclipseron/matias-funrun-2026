import { FormSectionHeader } from "../FormSectionHeader"

export const FormSectionOtherInfo = ({ headerText, wrapperClassname, formData, onInput, isLoading }) => {
  return (
    <div className={wrapperClassname}>
      <FormSectionHeader>{headerText}</FormSectionHeader>

      <div id="infoSource">
        <label className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
          Sumber Informasi Event
        </label>
        <p className='block text-sm text-slate-600 tracking-wider mb-1'>Darimana Anda memperoleh informasi terkait event ini?</p>
        <input
          type="text"
          id="infoSource"
          name="infoSource"
          value={formData.infoSource}
          onChange={onInput}
          placeholder="e.g. Instagram, Teman, Website"
          disabled={isLoading}
          className={`flat-input text-sm`}
        />
      </div>
    </div>
  )
}