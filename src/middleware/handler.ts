import { Response } from 'express'

export function handlerResponse(
  res: Response,
  success: boolean,
  status: number,
  data: any,
  options?: { fields: string },
) {
  res.status(status).json({
    success: success,
    status: status,
    data: {
      fields: options?.fields,
      message: data,
    },
  })
}
