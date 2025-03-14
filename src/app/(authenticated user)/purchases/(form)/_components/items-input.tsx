// types
import type { FormValues } from '../_types/form-values'
// vendors
import { Button } from '@nextui-org/button'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Input } from '@nextui-org/input'
import { Link } from '@nextui-org/link'
import { Select, SelectItem } from '@nextui-org/select'
import { useLiveQuery } from 'dexie-react-hooks'
import NextLink from 'next/link'
// icons
import { PlusCircleIcon, TrashIcon } from 'lucide-react'
// locals
import db from '@/models/db'
import PageUrlEnum from '@/enums/page-url'
import { InputAdditionalContent } from '@/components/input-additional-content'

export function ItemsInput() {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<FormValues>()
  const { remove, fields, append } = useFieldArray({
    control,
    name: 'items',
    rules: {
      required: 'Barang harus diisi',
      validate: items => {
        const names = items.map(item => item.product_state?.name)
        return new Set(names).size === names.length
          ? undefined
          : 'Barang tidak boleh sama'
      },
    },
  })

  const products = useLiveQuery(() => {
    return db.products.toArray()
  })

  return (
    <>
      <div className="flex items-center">
        <div className="text-sm font-bold">Daftar Barang</div>

        <Button
          isIconOnly
          variant="light"
          color="success"
          size="sm"
          onClick={() => append({})}>
          <PlusCircleIcon className="h-5 w-5" />
        </Button>
      </div>

      {errors.items && (
        <div className="ml-2 text-sm text-red-500">
          {errors.items.root?.message}
        </div>
      )}

      {fields.map((_, i) => {
        const selectedProduct = watch(`items.${i}.product_state`)

        return (
          <div key={i} className="flex items-center gap-3">
            <Controller
              control={control}
              name={`items.${i}.product_state`}
              rules={{ required: 'Nama biaya harus diisi' }}
              render={({
                field: { onChange, value, ...rest },
                fieldState: { error },
              }) => (
                <Select
                  isRequired
                  label="Produk"
                  description={
                    !products?.length ? (
                      <>
                        Data produk tidak ditemukan.{' '}
                        <Link
                          href={PageUrlEnum.PRODUCT_CREATE}
                          className="clickable text-xs"
                          as={NextLink}>
                          Tambah data produk?
                        </Link>
                      </>
                    ) : undefined
                  }
                  errorMessage={error?.message}
                  isInvalid={!!error}
                  value={value?.uuid}
                  onChange={({ target: { value } }) => {
                    const selectedProduct = products?.find(
                      product => product.uuid === value,
                    )

                    if (selectedProduct) {
                      onChange(selectedProduct)
                    }
                  }}
                  {...rest}>
                  {(products ?? []).map(product => (
                    <SelectItem key={product.uuid} value={product.uuid}>
                      {product.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              control={control}
              name={`items.${i}.qty`}
              rules={{ required: 'Jumlah barang harus diisi' }}
              render={({
                field: { onChange, value, ...rest },
                fieldState: { error },
              }) => (
                <Input
                  isRequired
                  label="Jumlah"
                  type="number"
                  value={value ? value.toString() : ''}
                  onValueChange={value => {
                    onChange(Number(value))
                  }}
                  endContent={
                    <InputAdditionalContent>
                      {selectedProduct?.qty_unit}
                    </InputAdditionalContent>
                  }
                  {...rest}
                  isInvalid={!!error}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name={`items.${i}.price`}
              rules={{ required: 'Harga beli satuan harus diisi' }}
              render={({
                field: { onChange, value, ...rest },
                fieldState: { error },
              }) => (
                <Input
                  isRequired
                  label="Harga Beli Satuan"
                  type="number"
                  value={value ? value.toString() : ''}
                  onValueChange={value => {
                    onChange(Number(value))
                  }}
                  startContent={
                    <InputAdditionalContent>Rp</InputAdditionalContent>
                  }
                  endContent={
                    <InputAdditionalContent>
                      /{selectedProduct?.qty_unit}
                    </InputAdditionalContent>
                  }
                  {...rest}
                  isInvalid={!!error}
                  errorMessage={error?.message}
                />
              )}
            />

            <Button
              isIconOnly
              variant="flat"
              color="danger"
              size="sm"
              tabIndex={-1}
              onClick={() => {
                remove(i)
              }}>
              <TrashIcon />
            </Button>
          </div>
        )
      })}
    </>
  )
}
