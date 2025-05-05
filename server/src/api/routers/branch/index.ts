import { BranchController } from '@controllers/branch.controller';
import { authenticationV2 } from '@middlewares/authentication';
import { hasPermission } from '@middlewares/authorization';
import { Router } from 'express';

const router = Router();

router.get('/', BranchController.getBranches);
router.get('/:id', BranchController.getBranchDetails);

router.use(authenticationV2);

router.post(
  '/',
  hasPermission('branch', 'createAny'),
  BranchController.createBranch
);
router.put(
  '/:id',
  hasPermission('branch', 'updateAny'),
  BranchController.updateBranch
);
router.delete(
  '/:id',
  hasPermission('branch', 'deleteAny'),
  BranchController.deleteBranch
);

module.exports = router;
