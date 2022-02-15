import { FormControl, FormErrorMessage, Grid, HStack, Input } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import Section from "components/common/Section"
import UploadFile from "components/create-auction/UploadFile"
import { usePinata } from "components/_app/PinataProvider"
import { AnimateSharedLayout } from "framer-motion"
import useToast from "hooks/useToast"
import { useEffect, useState } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import pinFileToIPFS from "utils/pinataUpload"
import NFTCard from "./components/NFTCard"
import useDropzone from "./hooks/useDropzone"

type Props = {
  setUploadPromise: (uploadPromise: Promise<void | void[]>) => void
}

const NFTData = ({ setUploadPromise }: Props) => {
  const toast = useToast()
  const [progresses, setProgresses] = useState<Record<string, number>>({})
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [imageErrors, setImageErrors] = useState<Record<string, string>>({})
  const { fields, append, remove } = useFieldArray({ name: "nfts" })
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  const { updateCredentials, pinFileToIPFS: pinWithExistingJWT } = usePinata()

  const nfts = useWatch({ name: "nfts" })

  useEffect(() => {
    register("asset.isRepeated")
  }, [])

  useEffect(() => {
    if (nfts.length === 1) setValue("asset.isRepeated", true)
    else setValue("asset.isRepeated", false)
  }, [nfts])

  const onDrop = (acceptedFiles: File[]) => {
    append(
      acceptedFiles.map((file) => ({
        file,
        traits: [],
        preview: URL.createObjectURL(file),
      }))
    )
  }

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
  })

  // Not triggering upload on acceptedFiles change, since we need the generated field ids
  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const newFields = fields.filter(
        ({ id }) => !(id in hashes || id in progresses)
      )

      if (newFields.length > 0) {
        setProgresses((prev) => ({
          ...prev,
          ...Object.fromEntries(newFields.map(({ id }) => [id, 0])),
        }))
        ;(async () => {
          const { jwt } = await updateCredentials()
          console.log(
            `Uploading ${newFields.length} image${newFields.length > 1 ? "s" : ""}`
          )

          const pinRequests = newFields.map(({ id }, index) =>
            pinFileToIPFS({
              jwt,
              data: [acceptedFiles[index]],
              onProgress: (progress) =>
                setProgresses((prev) => ({ ...prev, [id]: progress })),
            })
              .then(({ IpfsHash }) => {
                setHashes((prev) => ({ ...prev, [id]: IpfsHash }))
              })
              .catch((error) =>
                setImageErrors((prev) => ({
                  ...prev,
                  [id]:
                    typeof error === "string"
                      ? error
                      : error.message || "Something went wrong",
                }))
              )
          )

          setUploadPromise(
            Promise.all(pinRequests)
              .then(() => {
                console.log(
                  `Uploaded ${newFields.length} image${
                    newFields.length > 1 ? "s" : ""
                  }`
                )
              })
              .catch((error) => {
                toast({
                  status: "error",
                  title: "Upload failed",
                  description: error.message || "Failed to upload images to IPFS",
                })
              })
          )
        })()
      }
    }
  }, [fields, updateCredentials, pinFileToIPFS])

  const getUploadRetryFn = (fieldId: string, index: number) => () => {
    setImageErrors((prev) => {
      const newImageErrors = { ...prev }
      delete newImageErrors[fieldId]
      return newImageErrors
    })

    setProgresses((prev) => ({
      ...prev,
      [fieldId]: 0,
    }))

    setUploadPromise(
      pinWithExistingJWT({
        data: [nfts?.[index]?.file],
        onProgress: (progress) =>
          setProgresses((prev) => ({
            ...prev,
            [fieldId]: progress,
          })),
      })
        .then(({ IpfsHash }) => {
          setHashes((prev) => ({
            ...prev,
            [fieldId]: IpfsHash,
          }))
        })
        .catch((error) =>
          setImageErrors((prev) => ({
            ...prev,
            [fieldId]:
              typeof error === "string"
                ? error
                : error.message || "Something went wrong",
          }))
        )
    )
  }

  return (
    <>
      <Section title="NFT collection name and symbol">
        <HStack alignItems="start">
          <FormControl isInvalid={errors?.asset?.name} maxWidth="sm" w="full">
            <Input
              size="lg"
              {...register("asset.name", {
                required: "This field is required.",
              })}
            />
            <FormErrorMessage>{errors?.asset?.name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors?.asset?.symbol} w="auto">
            <Input
              size="lg"
              w="24"
              placeholder="SYMBL"
              {...register("asset.symbol", {
                required: "This field is required.",
              })}
            />
            <FormErrorMessage>{errors?.asset?.symbol?.message}</FormErrorMessage>
          </FormControl>
        </HStack>
      </Section>
      <Section title="NFTs to mint">
        <Grid
          templateColumns={{ sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
          gap="6"
          w="full"
        >
          <AnimateSharedLayout>
            {/* temporarily removing until we find a good solution because it's buggy with useFieldArray */}
            {/* <AnimatePresence> */}
            {fields.map((field, index) => (
              <NFTCard
                key={field.id}
                index={index}
                removeNft={() => remove(index)}
                progress={progresses[field.id] ?? 0}
                imageHash={hashes[field.id] ?? ""}
                error={imageErrors[field.id] ?? ""}
                retryUpload={
                  imageErrors[field.id]?.length > 0
                    ? getUploadRetryFn(field.id, index)
                    : undefined
                }
              />
            ))}
            {/* </AnimatePresence> */}
            <CardMotionWrapper>
              <UploadFile
                dropzoneProps={getRootProps()}
                inputProps={getInputProps()}
                isDragActive={isDragActive}
              />
            </CardMotionWrapper>
          </AnimateSharedLayout>
        </Grid>
      </Section>
    </>
  )
}

export default NFTData
