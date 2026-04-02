'use client'
import { ReactSelect, useField } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'


export function ConfiguredCollectionSlug(props: TextFieldClientProps & { options: { label: string, value: string }[] }) {
    const { path } = props || {}

    const { value, setValue } = useField({ path })

    const defaultValue = props?.options?.find(opts => {
        return opts.value === value
    })

    return <ReactSelect
        isSearchable={false}
        isClearable={false}
        isMulti={false}
        value={defaultValue}
        options={props?.options ?? []}
        onChange={option => {
            setValue(Array.isArray(option) ? option.at(0)?.value : option.value)
        }}
    />
}