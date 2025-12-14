import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { store, useAppDispatch, useAppSelector } from '../../../store';
import { updateShowRoomSettingsModal } from '../../../store/slices/roomSettingsSlice';
import Modal from '../../../helpers/ui/modal';
import Tabs from '../../../helpers/ui/tabs';
import ApplicationSettings from './application';
import DataSavings from './dataSavings';
import Ingress from './ingress';
import Notification from './notification';

const RoomSettings = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { currentUser, ingressFeatures } = useMemo(() => {
    const session = store.getState().session;
    return {
      currentUser: session.currentUser,
      ingressFeatures:
        session.currentRoom.metadata?.roomFeatures?.ingressFeatures,
    };
  }, []);

  const isShowRoomSettingsModal = useAppSelector(
    (state) => state.roomSettings.isShowRoomSettingsModal,
  );

  const baseCategories = {
    'header.room-settings.application': <ApplicationSettings />,
    'header.room-settings.data-savings': <DataSavings />,
    'header.room-settings.notifications': <Notification />,
  };
  if (currentUser?.metadata?.isAdmin && ingressFeatures?.isAllow) {
    baseCategories['header.room-settings.ingress'] = <Ingress />;
  }
  const tabItems = Object.keys(baseCategories).map((k) => ({
    id: k,
    title: t(k),
    content: baseCategories[k],
  }));

  const closeModal = () => {
    dispatch(updateShowRoomSettingsModal(false));
  };

  if (!isShowRoomSettingsModal) {
    return null;
  }

  return (
    <Modal
      show={true}
      onClose={closeModal}
      title={t('header.room-settings.title')}
      maxWidth="max-w-2xl"
    >
      <div className="wrap relative">
        <Tabs items={tabItems} tabPanelsCss="min-h-[316px]" />
      </div>
    </Modal>
  );
};

export default RoomSettings;
